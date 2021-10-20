package main

import (
	"fmt"
	"log"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func checkErrAndDie(err error) {
	if err != nil {
		log.Fatalf("An error has occurred: %s\n", err.Error())
	}
}

func sendErrToUser(bot *tgbotapi.BotAPI, chatID int64, err error) bool {
	if err != nil {
		msg := fmt.Sprintf("An error has occurred: %s", err.Error())
		log.Println(msg)
		_, e := bot.Send(tgbotapi.NewMessage(chatID, msg))
		checkErrAndDie(e)

	}
	return err != nil
}
