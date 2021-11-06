package main

import (
	"log"
	"os"
	"os/signal"
	"sync"

	"github.com/billy4479/telegram-storage/backend/api"
	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/joho/godotenv"
)

func main() {
	log.Default().SetOutput(os.Stdout)

	if len(os.Args) == 3 && os.Args[1] == "-loadEnv" {
		err := godotenv.Load(os.Args[2])
		if err != nil {
			log.Fatal(err)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "4479"
	}

	wg := sync.WaitGroup{}

	// Start bot
	wg.Add(1)
	botInterface := &bot.BotInterface{}
	stopBot := botInterface.Start(os.Getenv("TELEGRAM_TOKEN"))

	// Start API
	wg.Add(1)
	stopApi := api.ApiMain(":"+port, botInterface)

	// Wait for SIGINT
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	// Gracefully stop api and bot
	stopApi(&wg)
	stopBot(&wg)
}
