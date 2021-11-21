package api

import (
	"fmt"
	"net/http"

	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func getFormValueAndCheck(c echo.Context, name string) (string, error) {
	value := c.FormValue(name)
	if value == "" {
		return "", returnErrorJSON(c, http.StatusBadRequest, fmt.Errorf("%s is required", value))
	}
	return value, nil
}

func UploadFile(botInterface *bot.BotInterface) func(c echo.Context) error {
	return func(c echo.Context) error {
		// Get data from the request
		// path := c.FormValue("path")
		userID, err := getUserIDFromContext(c)
		if err != nil {
			return returnErrorJSON(c, http.StatusUnauthorized, err)
		}
		// Get user info
		user, err := db.GetUserByID(userID)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		file, err := c.FormFile("file")
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		// TODO: decode base64 and be sure that the size is right
		path, err := getFormValueAndCheck(c, "path")
		if err != nil {
			return err
		}
		header, err := getFormValueAndCheck(c, "header")
		if err != nil {
			return err
		}
		keyEnc, err := getFormValueAndCheck(c, "keyEnc")
		if err != nil {
			return err
		}
		nonce, err := getFormValueAndCheck(c, "nonce")
		if err != nil {
			return err
		}

		// Open the file
		r, err := file.Open()
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		// Upload it to telegram
		result, err := botInterface.UploadFile(user, path, r)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		result.Header = header
		result.KeyEnc = keyEnc
		result.Nonce = nonce

		// Store it into the database
		err = db.CreateFile(result)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, result)
	}

}
