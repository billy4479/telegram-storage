package bot

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func (i *BotInterface) GetFileURL(fileID string) (string, error) {
	filePath, err := i.bot.GetFile(tgbotapi.FileConfig{FileID: fileID})
	if err != nil {
		return "", err
	}

	res, err := http.Post("http://bot-api:4479/download", "text/plain", strings.NewReader(filePath.FilePath))
	if err != nil {
		return "", err
	}

	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	if res.StatusCode != 200 {
		return "", errors.New(string(b))
	}

	url := fmt.Sprintf("http://bot-api:4479/download/%s", string(b))
	fmt.Println(url)
	return url, nil
}
