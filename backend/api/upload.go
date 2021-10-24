package api

import (
	"net/http"

	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func upload(c echo.Context) error {
	// Get data from the request
	path := c.FormValue("path")
	file, err := c.FormFile("file")
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}
	id, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	// Get user info
	user, err := db.GetUserByID(id)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	// Open the file
	r, err := file.Open()
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	// Upload it to telegram
	record, err := bot.Instance.UploadFile(user, path, r, file.Size)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	// Store it into the database
	err = db.PutFile(record)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, record)
}
