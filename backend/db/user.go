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
			err = GetDB().Create(user).Error
			if err != nil {
				return err
			}
		}
		return err
	}
	err := GetDB().Save(user).Error
	if err != nil {
		return err
	}

	if _, err := GetRootOf(user.TelegramID); err != nil {
		if err == gorm.ErrRecordNotFound {
			if err = createRootOfUser(user); err != nil {
				return err
			}
			err = nil
		}
		return err
	}

	return nil
}
