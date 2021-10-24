package api

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func download(c echo.Context) error {
	idstr := c.Param("id")
	id, err := strconv.ParseUint(idstr, 10, 64)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	f, err := db.GetFileByID(id)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return returnErrorJSON(c, http.StatusNotFound, err)
		}
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	userid, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	if f.Owner != userid {
		return returnErrorJSON(c, http.StatusNotFound, gorm.ErrRecordNotFound)
	}

	res, err := http.Get(f.URL)
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

	_, err = io.Copy(c.Response().Writer, res.Body)
	if err != nil {
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	c.Response().Status = http.StatusOK

	return nil
}
