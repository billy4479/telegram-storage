package db

import "gorm.io/gorm"

type User struct {
	TelegramID int    `gorm:"primaryKey" json:"userID"`
	ChatID     int64  `gorm:"non null" json:"chatID"`
	Secret     []byte `gorm:"non null" json:"-"`
}

func GetUserByID(userID int) (*User, error) {
	var user User
	return &user, GetDB().Where("telegram_id = ?", userID).Take(&user).Error
}

func GetUserBySecret(userSecret []byte) (*User, error) {
	var user *User
	return user, GetDB().Take(&user, "secret = ?", userSecret).Error
}

func LinkUser(user *User) error {
	if _, err := GetUserByID(user.TelegramID); err != nil {
		if err == gorm.ErrRecordNotFound {
			return GetDB().Create(user).Error
		}
		return err
	}
	return GetDB().Save(user).Error
}
