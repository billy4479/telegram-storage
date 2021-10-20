package main

import (
	"fmt"
	"log"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func link(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	err := linkUser(&User{
		ID:     message.From.ID,
		ChatID: message.Chat.ID,
	})

	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}
	msg := fmt.Sprintf("Linking group %d as storage for user %d",
		message.Chat.ID, message.From.ID,
	)

	bot.Send(tgbotapi.NewMessage(message.Chat.ID, msg))

	log.Println(msg)
}

func addFile(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	document := message.Document

	// Get archive chat ID, fails if not linked
	chatID, err := getUserChat(message.From.ID)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	// Upload to storage chat
	file := tgbotapi.NewDocumentShare(chatID, document.FileID)
	file.Caption = message.Caption
	sent, _ := bot.Send(file)

	// Create record for database
	name := strings.ReplaceAll(document.FileName, "/", "")
	name = strings.ReplaceAll(name, "\\", "")
	name = strings.ReplaceAll(name, "*", "")

	path := message.Caption
	if path == "" {
		path = "/" + document.FileName
	}
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	path = strings.ReplaceAll(path, "\\", "/")

	url, err := bot.GetFileDirectURL(document.FileID)
	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	record := &File{
		Name:      name,
		Path:      path,
		Owner:     message.From.ID,
		ChatID:    chatID,
		MessageID: sent.MessageID,
		URL:       url,
	}
	err = putFile(record)

	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	msg := fmt.Sprintf("Saved `%s` in `%s`",
		record.Name, record.Path)
	bot.Send(tgbotapi.NewMessage(message.Chat.ID, msg))
	log.Println(msg)
}

func handleEvent(bot *tgbotapi.BotAPI, update tgbotapi.Update) {
	if update.Message == nil { // ignore any non-Message Updates
		return
	}
	message := update.Message

	if message.Chat.IsGroup() {
		if message.Text == "/link" {
			link(bot, message)
		}
		return
	}

	if message.Chat.IsPrivate() {
		if message.Document != nil {
			addFile(bot, message)
		}
	}
}
