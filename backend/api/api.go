package api

import (
	"context"
	"log"
	"os"
	"sync"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var signingSecret []byte

func ApiMain(addr string) func(*sync.WaitGroup) {
	{
		s := os.Getenv("secret")
		if s == "" {
			log.Fatal("secret is not defined")
		}
		signingSecret = []byte(s)
	}
	e := echo.New()
	e.Use(middleware.Logger())
	// e.Use(middleware.Recover())
	e.Use(middleware.RemoveTrailingSlash())
	e.Use(middleware.Secure())
	// TODO: CSRF

	e.HideBanner = true

	e.Static("/", "./build/public")
	api := e.Group("/api")

	api.POST("/login", login)
	api.GET("/files", getAllFiles, authorized)

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
