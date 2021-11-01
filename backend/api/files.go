package api

import (
	"net/http"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func getAllFiles(c echo.Context) error {
	id, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	// Error on non existing users
	_, err = db.GetUserByID(id)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	root, err := db.GetRootOf(id)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	content, err := db.GetChildrenInFolder(root)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, content)
}
