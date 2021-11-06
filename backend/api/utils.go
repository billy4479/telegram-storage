package api

import (
	"net/http"
	"strconv"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func returnErrorJSON(c echo.Context, code int, err error) error {
	if err != nil {
		return c.JSON(code, echo.Map{"status": code, "message": err.Error()})
	}
	return nil
}

func getIDAndUserIDFromContext(c echo.Context) (uint64, int64, error) {
	idStr := c.QueryParam("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return 0, 0, returnErrorJSON(c, http.StatusBadRequest, err)
	}

	userid, err := getUserIDFromContext(c)
	if err != nil {
		return 0, 0, returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	return id, userid, nil
}

func handleDBErr(c echo.Context, err error) error {
	if err == gorm.ErrRecordNotFound {
		if errJ := returnErrorJSON(c, http.StatusNotFound, err); errJ != nil {
			return errJ
		}
		return err
	}
	if err == db.ErrNonEmptyFolder {
		if errJ := returnErrorJSON(c, http.StatusBadRequest, err); errJ != nil {
			return errJ
		}
		return err
	}
	if err == db.ErrCannotCreateFolder || err == db.ErrAlreadyExists || err == db.ErrInvalidPath {
		if errJ := returnErrorJSON(c, http.StatusBadRequest, err); errJ != nil {
			return errJ
		}
		return err
	}

	if errJ := returnErrorJSON(c, http.StatusInternalServerError, err); errJ != nil {
		return errJ
	}
	return err
}
