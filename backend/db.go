package main

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type File struct {
	Name      string
	Path      string `gorm:"primaryKey"`
	Owner     int
	ChatID    int64
	MessageID int
	URL       string
}

type User struct {
	ID     int `gorm:"primaryKey"`
	ChatID int64
}

var globDB *gorm.DB

func initConnection() (err error) {
	dsn := "host=localhost user=postgres password=example dbname=telegram-storage port=5432 sslmode=disable"
	globDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err == nil {
		err = globDB.AutoMigrate(&User{}, &File{})
	}
	return
}

func getDB() *gorm.DB {
	if globDB == nil {
		checkErrAndDie(initConnection())
	}
	return globDB
}

func getFile(path string) (*File, error) {
	f := File{}
	return &f, getDB().Where("path = ?", path).Take(&f).Error
}

func putFile(f *File) error {
	return getDB().Create(f).Error
}

func getUserChat(userID int) (int64, error) {
	var user User
	return user.ChatID, getDB().Take(&user, userID).Error
}

func linkUser(user *User) error {
	return getDB().Create(user).Error
}
