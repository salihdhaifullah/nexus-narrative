package helpers

import (
	"golang.org/x/crypto/bcrypt"
)

// TODO: remove /x/crypto/bcrypt use built in crypto package

func HashPassword(password string) string {
	result, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(result)
}

func ComparePassword(hashPassword string, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashPassword), []byte(password))
	return err
}
