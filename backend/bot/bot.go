package bot

import (
	"log"
	"sync"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type BotInterface struct {
	bot *tgbotapi.BotAPI
}

func (i *BotInterface) Start(token string) func(*sync.WaitGroup) {
	bot, err := tgbotapi.NewBotAPI(token)
	checkErrAndDie(err)

	i.bot = bot

	log.Println("Starting", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates := bot.GetUpdatesChan(u)
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

			if !message.Chat.IsPrivate() {
				if message.Text == "/link" {
					i.linkChat(message)
				}
				continue
			}

		}
		stopped <- struct{}{}
	}()

	return func(wg *sync.WaitGroup) {
		stop = true
		<-stopped
		updates.Clear()
		wg.Done()
	}

}
