package bot

import (
	"io"

	"github.com/billy4479/telegram-storage/backend/db"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func (i *BotInterface) UploadFile(user *db.User, path string, r io.Reader) (*db.File, error) {
	docConfig := tgbotapi.NewDocument(user.ChatID, tgbotapi.FileReader{
		Name:   path,
		Reader: r,
	})

	msg, err := i.bot.Send(docConfig)
	if err != nil {
		return nil, err
	}

	url, err := i.bot.GetFileDirectURL(msg.Document.FileID)
	if err != nil {
		return nil, err
	}

	return &db.File{
		Path:  path,
		Owner: user.TelegramID,
		URL:   url,
	}, nil

}
