package main

import (
	"log"
	"os"
	"os/signal"
	"sync"

	"github.com/billy4479/telegram-storage/backend/api"
	"github.com/billy4479/telegram-storage/backend/bot"
)

func main() {
	log.Default().SetOutput(os.Stdout)

	wg := sync.WaitGroup{}
	wg.Add(1)
	stopBot := bot.BotMain("2074299171:AAH7gfFnSqRAvgpovVxx-hZLCGdiDY3WWuE")
	wg.Add(1)
	stopApi := api.ApiMain(":4479")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	stopApi(&wg)
	stopBot(&wg)

}
