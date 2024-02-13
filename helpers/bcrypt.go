package helpers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"strings"
)

func HashPassword(password string) (string, error) {
    salt := make([]byte, 16)
    _, err := rand.Read(salt)
    if err != nil {
        return "", err
    }

    saltedPassword := append([]byte(password), salt...)

    hashed := sha256.Sum256(saltedPassword)

    hashedPassword := base64.URLEncoding.EncodeToString(hashed[:])
    encodedSalt := base64.URLEncoding.EncodeToString(salt)

    hashedWithSalt := hashedPassword + "." + encodedSalt

    return hashedWithSalt, nil
}

func ComparePassword(hashedPassword string, password string) error {
    components := strings.Split(hashedPassword, ".")
    if len(components) != 2 {
        return errors.New("invalid hashed password format")
    }
    hashedPassword = components[0]
    encodedSalt := components[1]

    salt, err := base64.URLEncoding.DecodeString(encodedSalt)
    if err != nil {
        return err
    }

    saltedPassword := append([]byte(password), salt...)

    hashed := sha256.Sum256(saltedPassword)

    computedHash := base64.URLEncoding.EncodeToString(hashed[:])

    if computedHash != hashedPassword {
        return errors.New("passwords do not match")
    }

    return nil
}
