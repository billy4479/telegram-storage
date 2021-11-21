package api

import (
	"fmt"
	"net/http"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
)

func GetUser(c echo.Context) error {
	username := c.QueryParam("username")
	if username == "" {
		return returnErrorJSON(c, http.StatusBadRequest, fmt.Errorf("username parameter not found"))
	}

	user, err := db.GetUserByName(username)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
