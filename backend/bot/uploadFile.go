package bot

import (
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

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

	// Delete the file on our API server
	{
		filePath, err := i.bot.GetFile(tgbotapi.FileConfig{FileID: msg.Document.FileID})
		if err != nil {
			return nil, err
		}

		res, err := http.Post("http://bot-api:4479/notifyUpload", "text/plain", strings.NewReader(filePath.FilePath))
		if err != nil {
			return nil, err
		}

		b, err := ioutil.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}

		if res.StatusCode != 200 {
			return nil, errors.New(string(b))
		}
	}
return &db.File{
		Path:   path,
		Owner:  user.TelegramID,
		FileID: msg.Document.FileID,
	}, nil

}
