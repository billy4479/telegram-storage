package api

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
)

func ApiMain(addr string) func(*sync.WaitGroup) {
	e := echo.New()

	e.Static("/", "./build/public")

	go func() {
		if err := e.Start(addr); err != nil {
			log.Fatal(err)
		}
	}()

	return func(wg *sync.WaitGroup) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := e.Shutdown(ctx); err != nil {
			log.Fatal(err)
		}

		wg.Done()
	}
}
