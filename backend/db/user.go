package db

import (
	"errors"
	"log"

	"gorm.io/gorm"
)

var (
	ErrUserAlreadyExists = errors.New("The user already exists")
)

type User struct {
	TelegramID int64  `gorm:"primaryKey" json:"userID"`
	ChatID     int64  `gorm:"non null" json:"-"`
	Username   string `gorm:"username" json:"username"`

	MasterKeySalt     string `gorm:"non null" json:"masterKeySalt"`
	AuthenticationKey []byte `gorm:"non null" json:"-"`

	ShareKeyPublic     string `gorm:"non null" json:"shareKeyPublic"`
	ShareKeyPrivateEnc string `gorm:"non null" json:"shareKeyPrivate"`
	ShareKeyNonce      string `gorm:"non null" json:"shareKeyNonce"`
}

func GetUserByID(userID int64) (*User, error) {
	var user User
	return &user, getDB().Where("telegram_id = ?", userID).Take(&user).Error
}

func GetUserByName(username string) (*User, error) {
	var user *User
	return user, getDB().Take(&user, "username = ?", username).Error
}

func UpdateUser(user *User) error {
	return getDB().Save(user).Error
}

func CreateUser(user *User) error {
	if _, err := GetUserByID(user.TelegramID); err != nil {
		if err == gorm.ErrRecordNotFound {
			err = getDB().Create(user).Error
			if err != nil {
				return err
			}
		} else {
			return err
		}
	} else {
		return ErrUserAlreadyExists
	}

	_, err := GetRootOf(user.TelegramID)
	if err != nil {
		log.Println(err)
		if err == gorm.ErrRecordNotFound {
			log.Println("Creating root")
			return createRootOfUser(user)
		}
		return err
	}

	return nil
}
