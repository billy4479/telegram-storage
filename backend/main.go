package main

import (
	"log"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func main() {
	log.Default().SetOutput(os.Stdout)

	bot, err := tgbotapi.NewBotAPI("2074299171:AAH7gfFnSqRAvgpovVxx-hZLCGdiDY3WWuE")
	checkErrAndDie(err)

	log.Println("Starting", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)
	checkErrAndDie(err)
	updates.Clear()

	for update := range updates {
		handleEvent(bot, update)
	}

}
