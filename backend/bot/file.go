package bot

import (
	"fmt"
	"log"

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

	url, err := bot.GetFileDirectURL(document.FileID)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	// Create record for database
	record := &db.File{
		Path:  message.Caption,
		Owner: message.From.ID,
		URL:   url,
	}

	// Send the file
	_, err = bot.Send(file)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	// Store the file record in the database
	err = db.CreateFile(record)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	msg := fmt.Sprintf("Saved `%s` in `%s`",
		record.Name, record.Path)
	bot.Send(tgbotapi.NewMessage(message.Chat.ID, msg))
	log.Println(msg)
}
