package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var globDB *gorm.DB

func initConnection() (err error) {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	database := os.Getenv("DB_DATABASE")
	if user == "" || password == "" || database == "" {
		log.Fatal("DB credentials are not set")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable", host, user, password, database)
	globDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err == nil {
		err = globDB.AutoMigrate(&User{}, &File{}, &Folder{})
	}
	return
}

func GetDB() *gorm.DB {
	if globDB == nil {
		if err := initConnection(); err != nil {
			log.Fatal(err)
		}
	}
	return globDB
}
