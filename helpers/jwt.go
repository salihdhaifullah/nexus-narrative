package helpers

import (
	"crypto/hmac"
	"crypto/sha256"
	"fmt"
	"log"
	"os"
	"time"

	"encoding/base64"
	"encoding/json"
	"strings"
)

var (
    secretKey = GetSecretKey()
)

type CustomClaims struct {
    UserID string `json:"user_id"`
    ExpiresAt int64 `json:"exp"`
}

func NewToken(id string) string {
	claims := CustomClaims{
		UserID: id,
	}

	token, err := Encode(claims, time.Hour * 24 * 365)
	if err != nil {
		log.Fatal(err)
	}

	return token
}

func Encode(claims CustomClaims, duration time.Duration) (string, error) {
    claims.ExpiresAt = time.Now().Add(duration).Unix()

    claimsJSON, err := json.Marshal(claims)
    if err != nil {
        return "", err
    }

	encodedClaims := []byte{}

	base64.StdEncoding.Encode(encodedClaims, claimsJSON)
    signature := hmacSha256(encodedClaims)

    // Combine encoded claims and signature with a dot separator
	token := append(encodedClaims, '.')
	token = append(token, signature...)

    return string(token), nil
}

func Decode(token string) (*CustomClaims, error) {
    parts := strings.Split(token, ".")
    if len(parts) != 2 {
        return nil, fmt.Errorf("invalid token format")
    }

    signature := hmacSha256([]byte(parts[0]))
    if string(signature) != parts[1] {
        return nil, fmt.Errorf("invalid signature")
    }

	decodedClaims := []byte{}
	_, err := base64.StdEncoding.Decode(decodedClaims, []byte(parts[0]))
    if err != nil {
        return nil, err
    }

    var claims CustomClaims
    if err := json.Unmarshal(decodedClaims, &claims); err != nil {
        return nil, err
    }

    return &claims, nil
}



func hmacSha256(input []byte) []byte {
    h := hmac.New(sha256.New, secretKey)
    h.Write(input)
	dest := []byte{}
    base64.StdEncoding.Encode(dest, h.Sum(nil))
	return dest
}

func GetSecretKey() []byte {
	var secretKey []byte

	if len(os.Getenv("SECRET_KEY")) > 1 {
		secretKey = []byte(os.Getenv("SECRET_KEY"))
	} else {
		fmt.Println("No SECRET KEY Found For Jwt Will Use \"Hello World\" as SECRET KEY")
		secretKey = []byte("Hello World")
	}

	return secretKey
}
