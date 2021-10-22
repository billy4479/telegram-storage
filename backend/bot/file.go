package bot

import (
	"fmt"
	"log"
	"strings"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func addFile(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	document := message.Document

	// Get archive chat ID, fails if not linked
	user, err := db.GetUserByID(message.From.ID)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	// Upload to storage chat
	file := tgbotapi.NewDocumentShare(user.ChatID, document.FileID)
	file.Caption = message.Caption
	sent, _ := bot.Send(file)

	// Create record for database
	name := strings.ReplaceAll(document.FileName, "/", "")
	name = strings.ReplaceAll(name, "\\", "")

	path := message.Caption
	if path == "" {
		path = "/" + document.FileName
	}
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	path = strings.ReplaceAll(path, "\\", "/")

	{
		new := ""
		for {
			new = strings.ReplaceAll(path, "//", "/")
			if path == new {
				break
			}
			path = new
		}
	}

	url, err := bot.GetFileDirectURL(document.FileID)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	record := &db.File{
		Name:      name,
		Path:      path,
		Owner:     message.From.ID,
		ChatID:    user.ChatID,
		MessageID: sent.MessageID,
		URL:       url,
	}

	if !record.ValidatePath() {
		sendErrToUser(bot, message.Chat.ID, fmt.Errorf("The path %s is invalid", record.Path))
		return
	}

	{
		unique, err := record.IsUnique()
		if sendErrToUser(bot, message.Chat.ID, err) {
			return
		}

		if !unique {
			sendErrToUser(bot, message.Chat.ID, fmt.Errorf("%s already exists", record.Path))
			return
		}
	}

	err = db.PutFile(record)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	msg := fmt.Sprintf("Saved `%s` in `%s`",
		record.Name, record.Path)
	bot.Send(tgbotapi.NewMessage(message.Chat.ID, msg))
	log.Println(msg)
}
