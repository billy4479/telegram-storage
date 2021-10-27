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
		s := os.Getenv("SECRET")
		if s == "" {
			log.Fatal("SECRET is not defined")
		}
		signingSecret = []byte(s)
	}
	e := echo.New()
	{
		config := middleware.DefaultLoggerConfig
		config.Format = "${time_custom} ${remote_ip} made a ${method} to ${uri} in ${latency_human}: got ${status} ${error}\n"
		config.Output = os.Stdout
		config.CustomTimeFormat = "2006/01/02 15:04:05"
		e.Use(middleware.LoggerWithConfig(config))
	}
	// e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.RemoveTrailingSlash())
	e.Use(middleware.Secure())
	e.Use(middleware.CORS())
	// TODO: CSRF, CORS

	e.HideBanner = true

	e.Static("/", "./public")
	api := e.Group("/api")

	api.POST("/login", login)
	api.GET("/login", func(c echo.Context) error { return c.NoContent(http.StatusOK) }, authorized)
	api.GET("/files", getAllFiles, authorized)
	api.POST("/files", upload, authorized)
	api.GET("/download/:id", download, authorized)

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
