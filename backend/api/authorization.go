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
		ParseTokenFunc: func(auth string, c echo.Context) (interface{}, error) {
			keyFunc := func(t *jwt.Token) (interface{}, error) {
				if t.Method.Alg() != "HS256" {
					return nil, fmt.Errorf("Unexpected jwt signing method=%v", t.Header["alg"])
				}
				return signingSecret, nil
			}

			// claims are of type `jwt.MapClaims` when token is created with `jwt.Parse`
			token, err := jwt.Parse(auth, keyFunc)
			if err != nil {
				return nil, err
			}
			if !token.Valid {
				return nil, errors.New("Invalid token")
			}
			return token, nil
		},
	}
	authorized = middleware.JWTWithConfig(configJWT)
)

func getUserIDFromContext(c echo.Context) (int, error) {
	user := c.Get("user")
	if user == nil {
		return -1, fmt.Errorf("Token not found")
	}
	claims := user.(*jwt.Token).Claims.(jwt.MapClaims)
	id := int(claims["TelegramID"].(float64))
	return id, nil
}
