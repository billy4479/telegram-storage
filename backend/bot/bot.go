package bot

import (
	"io"
	"log"
	"sync"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

type BotAPI struct {
	UploadFile func(user *db.User, path string, r io.Reader, size int64) (*db.File, error)
}

var Instance *BotAPI = nil

func BotMain(token string) func(*sync.WaitGroup) {
	bot, err := tgbotapi.NewBotAPI(token)
	checkErrAndDie(err)

	log.Println("Starting", bot.Self.UserName)

	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	updates, err := bot.GetUpdatesChan(u)
	checkErrAndDie(err)
	updates.Clear()

	Instance = &BotAPI{
		UploadFile: uploadFile(bot),
	}

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
					linkChat(bot, message)
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
