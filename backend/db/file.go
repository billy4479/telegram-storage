package db

import (
	"strings"

	"gorm.io/gorm"
)

type File struct {
	Name      string `gorm:"non null" json:"name"`
	Path      string `gorm:"non null" json:"path"`
	Owner     int    `gorm:"non null" json:"userID"`
	ChatID    int64  `gorm:"non null" json:"chatID"`
	MessageID int    `gorm:"non null" json:"messageID"`
	URL       string `gorm:"primaryKey" json:"url"`
}

func (f *File) ValidatePath() bool {

	if f.Path == "" {
		return false
	}

	// Check if the name is all dots
	if strings.Count(f.Path, ".") == len(f.Path) {
		return false
	}

	return true
}

func (f *File) IsUnique() (bool, error) {
	var c int64
	err := GetDB().Model(&File{}).Where("path = ? AND owner = ?", f.Path, f.Owner).Count(&c).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return true, nil
		}
		return false, err
	}

	return c == 1 || c == 0, nil
}

func GetFile(path string) (*File, error) {
	f := File{}
	return &f, GetDB().Where("path = ?", path).Take(&f).Error
}

func GetAllFilesOwnedBy(userID int) ([]File, error) {
	f := []File{}
	return f, GetDB().Where("owner = ?", userID).Find(&f).Error
}

func PutFile(f *File) error {
	return GetDB().Create(f).Error
}
