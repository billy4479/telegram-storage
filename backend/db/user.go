package db

import (
	"log"

	"gorm.io/gorm"
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

// func GetUserByAuth(userSecret []byte) (*User, error) {
// 	var user *User
// 	return user, getDB().Take(&user, "authentication_key = ?", userSecret).Error
// }

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
