package api

import (
	"encoding/base64"
	"net/http"
	"time"

	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/sha3"
)

type userClaims struct {
	jwt.StandardClaims
	ID int64
}

type loginRequest struct {
	Username          string `json:"username"`
	AuthenticationKey string `json:"authKey"`
}

func Login(c echo.Context) error {
	var s loginRequest
	err := c.Bind(&s)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	authKey, err := base64.URLEncoding.DecodeString(s.AuthenticationKey)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	authKeyHash := sha3.Sum512(authKey)

	user, err := db.GetUserByAuth(authKeyHash[:])
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	claims := &userClaims{
		ID: user.TelegramID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 10).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(signingSecret)
	if err != nil {
		return returnErrorJSON(c, http.StatusUnauthorized, err)
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token":  t,
		"encKey": base64.URLEncoding.EncodeToString(user.EncryptionKey),
	})
}

func CheckLogin(c echo.Context) error { return c.NoContent(http.StatusOK) }
