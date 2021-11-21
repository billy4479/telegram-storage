package bot

import (
	"log"
	"sync"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type BotInterface struct {
	bot *tgbotapi.BotAPI

	// This function will be provided by the API
	GetTempJWT func(userID int64, chatID int64) (string, error)
}

func (i *BotInterface) GetUsernameFromID(id int64) (string, error) {
	chat, err := i.bot.GetChat(tgbotapi.ChatInfoConfig{
		ChatConfig: tgbotapi.ChatConfig{ChatID: id},
	})

	return chat.UserName, err
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

			if update.Message == nil ||
				!update.Message.IsCommand() ||
				update.Message.Chat.IsPrivate() {
				continue
			}

			if update.Message.Command() == "link" {
				i.linkChat(update.Message)
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
