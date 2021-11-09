package api

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	configJWT = middleware.JWTConfig{
		ParseTokenFunc: func(raw string, c echo.Context) (interface{}, error) {
			return parseJWT(raw)
		},
	}
	authorized = middleware.JWTWithConfig(configJWT)
)

// Claims are of type `jwt.MapClaims`
func parseJWT(raw string) (*jwt.Token, error) {
	keyFunc := func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != "HS256" {
			return nil, fmt.Errorf("Unexpected jwt signing method=%v", t.Header["alg"])
		}
		return signingSecret, nil
	}

	token, err := jwt.Parse(raw, keyFunc)
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("Invalid token")
	}
	return token, nil
}

func getUserIDFromContext(c echo.Context) (int64, error) {
	user := c.Get("user")
	if user == nil {
		return -1, fmt.Errorf("Token not found")
	}
	claims := user.(*jwt.Token).Claims.(jwt.MapClaims)
	id := int64(claims["TelegramID"].(float64))
	return id, nil
}
