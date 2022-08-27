package api

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"net/http"
	"time"

	"github.com/billy4479/telegram-storage/backend/bot"
	"github.com/billy4479/telegram-storage/backend/db"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/sha3"
	"gorm.io/gorm"
)

type userClaims struct {
	jwt.StandardClaims
	ID int64
}

type loginRequest struct {
	Username          string `json:"username"`
	AuthenticationKey string `json:"authKey"`
}

func Login(botInterface *bot.BotInterface) func(c echo.Context) error {
	return func(c echo.Context) error {
		var data loginRequest
		err := c.Bind(&data)
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		authKey, err := base64.StdEncoding.DecodeString(data.AuthenticationKey)
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}
		authKeyHash := sha3.Sum512(authKey)

		user, err := db.GetUserByName(data.Username)
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				return returnErrorJSON(c, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
			}
			if err = handleDBErr(c, err); err != nil {
				return err
			}
		}

		if !bytes.Equal(user.AuthenticationKey, authKeyHash[:]) {
			return returnErrorJSON(c, http.StatusUnauthorized, fmt.Errorf("Unauthorized"))
		}

		name, err := botInterface.GetUsernameFromID(user.TelegramID)
		if err != nil {
			return returnErrorJSON(c, http.StatusInternalServerError, err)
		}

		// Check if the username has changed since last login
		if name != user.Username {
			user.Username = name
			err = db.UpdateUser(user)
			if err != nil {
				return returnErrorJSON(c, http.StatusInternalServerError, err)
			}
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
			"token": t,
			"user":  user,
		})
	}
}

func CheckLogin(c echo.Context) error { return c.NoContent(http.StatusOK) }
