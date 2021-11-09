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

type registrationClaims struct {
	jwt.StandardClaims
	UserID int64 `json:"userID"`
	ChatID int64 `json:"chatID"`
}

func GetTempJWTFactory() func(int64, int64) (string, error) {
	return func(userID int64, chatID int64) (string, error) {
		claims := &registrationClaims{
			UserID: userID,
			ChatID: chatID,
			StandardClaims: jwt.StandardClaims{
				ExpiresAt: time.Now().Add(5 * time.Minute).Unix(),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		return token.SignedString(signingSecret)
	}
}

type registerRequest struct {
	JWT               string `json:"jwt"`
	AuthenticationKey string `json:"authKey"`
	EncryptionKey     string `json:"encKey"`
}

func Register(c echo.Context) error {
	data := registerRequest{}
	err := c.Bind(&data)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	token, err := parseJWT(data.JWT)
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	encKey := make([]byte, 32)
	_, err = base64.URLEncoding.Decode(encKey, []byte(data.EncryptionKey))
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}

	authKey := make([]byte, 32)
	_, err = base64.URLEncoding.Decode(authKey, []byte(data.AuthenticationKey))
	if err != nil {
		return returnErrorJSON(c, http.StatusBadRequest, err)
	}
	authKeyHash := sha3.Sum256(authKey)

	claimsMap := token.Claims.(jwt.MapClaims)
	user := db.User{
		TelegramID:        int64(claimsMap["userID"].(float64)),
		ChatID:            int64(claimsMap["chatID"].(float64)),
		EncryptionKey:     encKey,
		AuthenticationKey: authKeyHash[:],
	}

	err = db.CreateUser(&user)
	if err = handleDBErr(c, err); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, user)
}
