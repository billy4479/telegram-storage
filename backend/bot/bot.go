package bot

import (
	"log"
	"sync"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func BotMain(token string) func(*sync.WaitGroup) {
	bot, err := tgbotapi.NewBotAPI(token)
	checkErrAndDie(err)

	log.Println("Starting", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)
	checkErrAndDie(err)
	updates.Clear()

	stop := false

	stopped := make(chan struct{})

	go func() {
		for update := range updates {
			if stop {
				break
			}

			if update.Message == nil { // ignore any non-Message Updates
				continue
			}
			message := update.Message

			if message.Chat.IsGroup() {
				if message.Text == "/link" {
					linkChat(bot, message)
				}
				continue
			}

			if message.Chat.IsPrivate() {
				if message.Document != nil {
					addFile(bot, message)
				}
			}
		}
		stopped <- struct{}{}
	}()

	return func(wg *sync.WaitGroup) {
		stop = true
		<-stopped
		wg.Done()
	}

}
