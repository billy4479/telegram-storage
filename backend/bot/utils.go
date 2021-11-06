package bot

import (
	"fmt"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func checkErrAndDie(err error) {
	if err != nil {
		log.Fatalf("[BOT]: Fatal error: %s\n", err.Error())
	}
}

func (i *BotInterface) sendErrToUser(chatID int64, err error) bool {
	if err != nil {
		msg := fmt.Sprintf("An error has occurred: %s", err.Error())
		log.Printf("[BOT]: %s\n", msg)
		_, e := i.bot.Send(tgbotapi.NewMessage(chatID, msg))
		checkErrAndDie(e)

	}
	return err != nil
}
