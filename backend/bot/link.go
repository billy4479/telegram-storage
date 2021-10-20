package bot

import (
	"fmt"
	"log"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func linkChat(bot *tgbotapi.BotAPI, message *tgbotapi.Message) {
	err := db.LinkUser(&db.User{
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
