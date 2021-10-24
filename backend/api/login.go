package api

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/sha3"
	"gorm.io/gorm"
)

type userClaims struct {
	TelegramID int
	ChatID     int64
	jwt.StandardClaims
}

type userSecret struct {
	UserSecret string `json:"userSecret" form:"userSecret" `
}

var nullSecret = []byte{
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0,
}

func login(c echo.Context) error {
	var s userSecret
	err := c.Bind(&s)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	h, err := base64.StdEncoding.DecodeString(s.UserSecret)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}
	if len(h) != 63 {
		return returnErrorJSON(c, http.StatusBadRequest, fmt.Errorf("Invalid secret"))
	}
	secret := sha3.Sum512(h)

	if bytes.Equal(secret[:], nullSecret) {
		return returnErrorJSON(c, http.StatusUnauthorized, fmt.Errorf("User not found"))
	}

	user, err := db.GetUserBySecret(secret[:])
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return returnErrorJSON(c, http.StatusUnauthorized, fmt.Errorf("User not found"))
		}
		return returnErrorJSON(c, http.StatusInternalServerError, err)
	}

	claims := &userClaims{
		TelegramID: user.TelegramID,
		ChatID:     user.ChatID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24 * 3).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(signingSecret)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": t,
	})
}
