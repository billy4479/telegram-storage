package db

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

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
		if err := initConnection(); err != nil {
			log.Fatal(err)
		}
	}
	return globDB
}
