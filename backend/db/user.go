package db

import (
	"log"

	"gorm.io/gorm"
)

type User struct {
	TelegramID int64  `gorm:"primaryKey" json:"userID"`
	ChatID     int64  `gorm:"non null" json:"chatID"`
	Secret     []byte `gorm:"non null" json:"-"`
}

func GetUserByID(userID int64) (*User, error) {
	var user User
	return &user, getDB().Where("telegram_id = ?", userID).Take(&user).Error
}

func GetUserBySecret(userSecret []byte) (*User, error) {
	var user *User
	return user, getDB().Take(&user, "secret = ?", userSecret).Error
}

func LinkUser(user *User) error {
	if _, err := GetUserByID(user.TelegramID); err != nil {
		if err == gorm.ErrRecordNotFound {
			err = getDB().Create(user).Error
			if err != nil {
				return err
			}
		}
		return err
	} else {
		err := getDB().Save(user).Error
		if err != nil {
			return err
		}
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
