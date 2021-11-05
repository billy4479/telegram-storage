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
		s := os.Getenv("SECRET")
		if s == "" {
			log.Fatal("SECRET is not defined")
		}
		signingSecret = []byte(s)
	}

	e := echo.New()
	e.HideBanner = true
	e.Debug = true

	// Middlewares
	{
		{
			config := middleware.DefaultLoggerConfig
			config.Format = "${time_custom} ${remote_ip} made a ${method} to ${uri} in ${latency_human}: got ${status} ${error}\n"
			config.Output = os.Stdout
			config.CustomTimeFormat = "2006/01/02 15:04:05"
			e.Use(middleware.LoggerWithConfig(config))
		}
		// e.Use(middleware.Logger())
		if !e.Debug {
			e.Use(middleware.Recover())
		}
		e.Use(middleware.RemoveTrailingSlash())
		e.Use(middleware.Secure())
		e.Use(middleware.CORS())
	}

	e.Static("/", "./public")

	{
		api := e.Group("/api")

		// Login
		api.POST("/login", Login)
		api.GET("/login", CheckLogin, authorized)

		// File
		api.GET("/file", GetFile, authorized)
		api.POST("/file", UploadFile, authorized)
		api.DELETE("/file", DeleteFile, authorized)
		api.PUT("/file", UpdateFile, authorized)
		api.GET("/file/download", DownloadFile, authorized)

		// Folder
		api.GET("/folder", GetFolder, authorized)
		api.POST("/folder", CreateFolder, authorized)
		api.DELETE("/folder", DeleteFolder, authorized)
		api.PUT("/folder", UpdateFolder, authorized)
		api.GET("/folder/list", ListContent, authorized)
		api.GET("/folder/root", GetRoot, authorized)
		api.GET("/folder/tree", GetTree, authorized)
	}

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
