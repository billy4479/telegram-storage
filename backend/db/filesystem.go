package db

import (
	"errors"
	"strings"
)

func (f *FolderContent) Length() int { return len(f.Files) + len(f.Folder) }

type FolderContent struct {
	Files  []*File   `gorm:"foreignKey:ID" json:"files"`
	Folder []*Folder `gorm:"foreignKey:ID" json:"folders"`
}

var (
	ErrAlreadyExists      = errors.New("An entry with the same name is already there")
	ErrInvalidPath        = errors.New("The path is invalid")
	ErrCannotCreateFolder = errors.New("Cannot create folder")
	ErrNonEmptyFolder     = errors.New("The folder is not empty")
)

func sanitizePath(path *string) error {
	// Only root directory can have an empty path
	if *path == "" {
		return ErrInvalidPath
	}

	// Replace \ with /
	*path = strings.ReplaceAll(*path, "\\", "/")

	// If doesn't start with a / assume it does
	if !strings.HasPrefix(*path, "/") {
		*path = "/" + *path
	}

	// Remove last /
	if strings.HasSuffix(*path, "/") {
		*path = (*path)[:len(*path)-1]
	}

	// Ensure no double / are there
	{
		new := ""
		for {
			new = strings.ReplaceAll(*path, "//", "/")
			if *path == new {
				break
			}
			*path = new
		}
	}

	// Not sure if it is a problem but it might
	if strings.Contains(*path, "/..") || strings.Contains(*path, "/.") {
		return ErrInvalidPath
	}

	return nil
}

func createRootOfUser(user *User) error {
	root := &Folder{
		Name:  "",
		Path:  "/",
		Owner: user.TelegramID,
	}
	return getDB().Create(root).Error
}

func calculatePath(parentID uint64, name string, userID int64) (string, error) {
	parent, err := GetFolderByID(parentID, userID)
	if err != nil {
		return "", err
	}

	path := parent.Path + "/" + name
	err = sanitizePath(&path)
	return path, err
}
