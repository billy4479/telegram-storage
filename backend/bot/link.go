package bot

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"golang.org/x/crypto/sha3"
)

func linkChat(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	secret := make([]byte, 64)
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
	msg := fmt.Sprintf("Linking group %d as storage for user %d. You're secret is %s",
		message.Chat.ID, message.From.ID, base64.StdEncoding.EncodeToString(secret),
	)

	bot.Send(tgbotapi.NewMessage(int64(message.From.ID), msg))

	log.Println(msg)
}
