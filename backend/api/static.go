package api

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v4"
)

func Static(prefix string, root string, fallback string) func(c echo.Context) error {
	return func(c echo.Context) error {
		reqPath := c.Request().URL.Path

		if !strings.HasPrefix(reqPath, prefix) {
			return returnErrorJSON(c, http.StatusInternalServerError, fmt.Errorf("Prefix is not in path"))
		}

		path := filepath.Join(root, filepath.Clean("./"+reqPath[len(prefix):]))

		info, err := os.Stat(path)
		if err != nil {
			return c.File(filepath.Join(root, fallback))
		}

		if info.IsDir() {
			return c.File(filepath.Join(path, "index.html"))
		}

		return c.File(path)
	}
}
