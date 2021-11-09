package bot

import (
	"fmt"
	"log"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func (i *BotInterface) linkChat(message *tgbotapi.Message) {

	tmpJWT, err := i.GetTempJWT(message.From.ID, message.Chat.ID)
	if i.sendErrToUser(message.Chat.ID, err) {
		return
	}

	text := fmt.Sprintf("Linking group \"%s\" as storage for user @%s.\nYou're temporary token is `%s`",
		message.Chat.Title, message.From.UserName, tmpJWT,
	)
	text = strings.ReplaceAll(text, ".", "\\.")
	text = strings.ReplaceAll(text, "+", "\\+")
	text = strings.ReplaceAll(text, "_", "\\_")
	text = strings.ReplaceAll(text, "-", "\\-")

	msg := tgbotapi.NewMessage(int64(message.From.ID), text)
	msg.ParseMode = "MarkdownV2"
	if _, err := i.bot.Send(msg); i.sendErrToUser(message.Chat.ID, err) {
		return
	}

	log.Println(text)
}
