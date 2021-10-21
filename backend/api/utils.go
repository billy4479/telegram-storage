package api

import "github.com/labstack/echo/v4"

func returnErrorJSON(c echo.Context, code int, err error) error {
	return c.JSON(code, echo.Map{"status": code, "message": err.Error()})
}
