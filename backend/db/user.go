package db

type User struct {
	ID     int `gorm:"primaryKey"`
	ChatID int64
}

func GetUserChat(userID int) (int64, error) {
	var user User
	return user.ChatID, getDB().Take(&user, userID).Error
}

func LinkUser(user *User) error {
	return getDB().Create(user).Error
}
