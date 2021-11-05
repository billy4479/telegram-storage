package api

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func GetFolder(c echo.Context) error {
	idStr := c.QueryParam("id")
	userid, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	if idStr == "" {
		path := c.QueryParam("path")
		if path == "" {
			return returnErrorJSON(c, http.StatusBadRequest, errors.New("An id or a path is expected"))
		}
		folder, err := db.GetFolderByPath(path, userid)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return returnErrorJSON(c, http.StatusNotFound, err)
			}
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		return c.JSON(http.StatusOK, folder)
	}

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	folder, err := db.GetFolderByID(id, userid)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return returnErrorJSON(c, http.StatusNotFound, err)
		}
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusOK, folder)
}

type createFolderData struct {
	Path string `json:"path"`
}

func CreateFolder(c echo.Context) error {
	// TODO: accept also parent id + name
	data := createFolderData{}
	err := c.Bind(&data)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	id, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	folder := &db.Folder{
		Path:  data.Path,
		Owner: id,
	}

	err = db.CreateFolder(folder)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, folder)
}

func DeleteFolder(c echo.Context) error {
	recursive := c.QueryParam("recursive")
	id, userid, err := getIDAndUserIDFromContext(c)
	if err != nil {
		return err
	}

	if recursive == "yes" {
		err = db.DeleteFolderRecursive(id, userid)
	} else {
		err = db.DeleteFolder(id, userid)
	}

	if err = handleDBErr(c, err); err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

func ListContent(c echo.Context) error {
	id, userid, err := getIDAndUserIDFromContext(c)
	if err != nil {
		return err
	}
	result, err := db.GetChildrenInFolder(&db.Folder{ID: id, Owner: userid})
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, result)
}

func GetTree(c echo.Context) error {
	id, userid, err := getIDAndUserIDFromContext(c)
	if err != nil {
		return err
	}

	folder, err := db.GetFolderByID(id, userid)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	result, err := db.GetChildrenRecursive(folder)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, result)
}

func GetRoot(c echo.Context) error {
	id, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	folder, err := db.GetRootOf(id)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, folder)
}

func UpdateFolder(c echo.Context) error {
	userid, err := getUserIDFromContext(c)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	var folder db.Folder
	err = c.Bind(&folder)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	err = db.EditFolder(&folder, userid)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, folder)
}
