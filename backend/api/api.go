package api

import (
	"context"
	"log"
	"net/http"
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
	{
		config := middleware.DefaultLoggerConfig
		config.Format = "${time_custom} ${remote_ip} made a ${method} to ${uri} in ${latency_human}: got ${status} ${error}"
		config.Output = os.Stdout
		config.CustomTimeFormat = "2006/01/02 15:04:05"
		e.Use(middleware.LoggerWithConfig(config))
	}
	// e.Use(middleware.Recover())
	e.Use(middleware.RemoveTrailingSlash())
	e.Use(middleware.Secure())
	// TODO: CSRF

	e.HideBanner = true

	e.Static("/", "./build/public")
	api := e.Group("/api")

	api.POST("/login", login)
	api.GET("/login", func(c echo.Context) error { return c.NoContent(http.StatusOK) }, authorized)
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
