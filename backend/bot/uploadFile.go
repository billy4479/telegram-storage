package bot

import (
	"io"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func uploadFile(bot *tgbotapi.BotAPI) func(user *db.User, path string, r io.Reader, size int64) (*db.File, error) {
	return func(user *db.User, path string, r io.Reader, size int64) (*db.File, error) {
		docConfig := tgbotapi.NewDocumentUpload(user.ChatID, tgbotapi.FileReader{
			Name:   path,
			Reader: r,
			Size:   size,
		})

		msg, err := bot.Send(docConfig)
		if err != nil {
			return nil, err
		}

		url, err := bot.GetFileDirectURL(msg.Document.FileID)
		if err != nil {
			return nil, err
		}

		return &db.File{
			Path:  path,
			Owner: user.TelegramID,
			URL:   url,
		}, nil
	}
}
