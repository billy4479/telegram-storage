package bot

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"strings"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"golang.org/x/crypto/sha3"
)

func (i *BotInterface) linkChat(message *tgbotapi.Message) {
	secret := make([]byte, 63)
	_, err := rand.Read(secret)
	if err != nil {
		i.sendErrToUser(message.Chat.ID, err)
	}
	h := sha3.Sum512(secret)

	err = db.LinkUser(&db.User{
		TelegramID: message.From.ID,
		ChatID:     message.Chat.ID,
		Secret:     h[:],
	})

	if i.sendErrToUser(message.Chat.ID, err) {
		return
	}

	text := fmt.Sprintf("Linking group \"%s\" as storage for user @%s. You're secret is `%s`",
		message.Chat.Title, message.From.UserName, base64.URLEncoding.EncodeToString(secret),
	)
	text = strings.ReplaceAll(text, ".", "\\.")
	text = strings.ReplaceAll(text, "+", "\\+")
	text = strings.ReplaceAll(text, "_", "\\_")
	text = strings.ReplaceAll(text, "-", "\\-")

	msg := tgbotapi.NewMessage(int64(message.From.ID), text)
	msg.ParseMode = "MarkdownV2"
	if _, err = i.bot.Send(msg); i.sendErrToUser(message.Chat.ID, err) {
		return
	}

	log.Println(text)
}
