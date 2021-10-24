package bot

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"strings"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"golang.org/x/crypto/sha3"
)

func linkChat(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	secret := make([]byte, 63)
	_, err := rand.Read(secret)
	if err != nil {
		sendErrToUser(bot, message.Chat.ID, err)
	}
	h := sha3.Sum512(secret)

	err = db.LinkUser(&db.User{
		TelegramID: message.From.ID,
		ChatID:     message.Chat.ID,
		Secret:     h[:],
	})

	if sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	text := fmt.Sprintf("Linking group \"%s\" as storage for user @%s. You're secret is `%s`",
		message.Chat.Title, message.From.UserName, base64.StdEncoding.EncodeToString(secret),
	)
	text = strings.ReplaceAll(text, ".", "\\.")
	text = strings.ReplaceAll(text, "+", "\\+")
	text = strings.ReplaceAll(text, "_", "\\_")
	text = strings.ReplaceAll(text, "-", "\\-")

	msg := tgbotapi.NewMessage(int64(message.From.ID), text)
	msg.ParseMode = "MarkdownV2"
	if _, err = bot.Send(msg); sendErrToUser(bot, message.Chat.ID, err) {
		return
	}

	log.Println(text)
}
