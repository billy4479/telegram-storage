package api

import (
	"encoding/base64"
	"net/http"

	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func UploadFile(botInterface *bot.BotInterface) func(c echo.Context) error {
	return func(c echo.Context) error {
		// Get data from the request
		// path := c.FormValue("path")
		id, err := getUserIDFromContext(c)
		if err != nil {
			return returnErrorJSON(c, http.StatusUnauthorized, err)
		}
		// Get user info
		user, err := db.GetUserByID(id)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		form, err := c.MultipartForm()
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		result := []*db.File{}

		files := form.File["files"]
		for _, file := range files {
			// Open the file
			r, err := file.Open()
			if err != nil {
				return returnErrorJSON(c, http.StatusBadRequest, err)
			}
			path, err := base64.URLEncoding.DecodeString(file.Filename)
			if err != nil {
				return returnErrorJSON(c, http.StatusBadRequest, err)
			}

			// Upload it to telegram
			record, err := botInterface.UploadFile(user, string(path), r)
			if err != nil {
				return returnErrorJSON(c, http.StatusInternalServerError, err)
			}

			// Store it into the database
			err = db.CreateFile(record)
			if err != nil {
				return returnErrorJSON(c, http.StatusInternalServerError, err)
			}

			result = append(result, record)
		}

		return c.JSON(http.StatusOK, result)
	}
}
