package api

import (
	"encoding/base64"
	"net/http"
	"time"

	"github.com/billy4479/telegram-storage/backend/bot"
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

type keys struct {
	MasterKeySalt string `json:"masterKeySalt"`
	AuthKey       string `json:"authKey"`

	SharePublicKey     string `json:"sharePublicKey"`
	SharePrivateKeyEnc string `json:"sharePrivateKeyEnc"`
}

type registerRequest struct {
	JWT  string `json:"jwt"`
	Keys keys   `json:"keys"`
}

func Register(botInterface *bot.BotInterface) func(c echo.Context) error {
	return func(c echo.Context) error {
		data := registerRequest{}
		err := c.Bind(&data)
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		token, err := parseJWT(data.JWT)
		if err != nil {
			return returnErrorJSON(c, http.StatusUnauthorized, err)
		}

		authKey, err := base64.StdEncoding.DecodeString(data.Keys.AuthKey)
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}
		authKeyHash := sha3.Sum512(authKey)

		claimsMap := token.Claims.(jwt.MapClaims)
		userID := int64(claimsMap["userID"].(float64))

		username, err := botInterface.GetUsernameFromID(userID)
		if err != nil {
			return returnErrorJSON(c, http.StatusBadRequest, err)
		}

		user := db.User{
			TelegramID: userID,
			ChatID:     int64(claimsMap["chatID"].(float64)),
			Username:   username,

			MasterKeySalt:     data.Keys.MasterKeySalt,
			AuthenticationKey: authKeyHash[:],

			ShareKeyPublic:     data.Keys.SharePublicKey,
			ShareKeyPrivateEnc: data.Keys.SharePrivateKeyEnc,
		}

		err = db.CreateUser(&user)
		if err = handleDBErr(c, err); err != nil {
			return err
		}

		return c.JSON(http.StatusOK, user)
	}
}
