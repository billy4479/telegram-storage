package api

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func GetFile(c echo.Context) error {
	id, userid, err := getIDAndUserIDFromContext(c)
	if err != nil {
		return err
	}

	content, err := db.GetFileByID(id, userid)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, content)
}

func DownloadFile(i *bot.BotInterface) func(c echo.Context) error {
	return func(c echo.Context) error {
		id, userid, err := getIDAndUserIDFromContext(c)
		if err != nil {
			return err
		}

		f, err := db.GetFileByID(id, userid)
		if err = handleDBErr(c, err); err != nil {
			return err
		}

		url, err := i.GetFileURL(f.FileID)
		if err != nil {
			return returnErrorJSON(c, http.StatusNotFound, err)
		}

		res, err := http.Get(url)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			b, err := ioutil.ReadAll(res.Body)
			if err != nil {
				return err
			}
			return returnErrorJSON(c, res.StatusCode, fmt.Errorf(string(b)))
		}

		// TODO: Fix Content-Type, maybe store it with the file itself
		return c.Stream(http.StatusOK, res.Header.Get("Content-Type"), res.Body)
	}
}

func DeleteFile(c echo.Context) error {
	id, userid, err := getIDAndUserIDFromContext(c)
	if err != nil {
		return err
	}

	err = db.DeleteFile(id, userid)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.NoContent(http.StatusOK)
}

func UpdateFile(c echo.Context) error {
	userid, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	var file db.File
	err = c.Bind(&file)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	err = db.EditFile(&file, userid)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, file)
}
