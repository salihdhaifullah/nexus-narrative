package helpers

import (
	"fmt"
	"log"
	"math/rand"
	"time"
)

func InitCode() string {
	code := rand.Intn(1000000)
	return fmt.Sprintf("%06d", code)
}

func GenerateSlug(seed string, checkIsFound func(slug string) bool) string {
	baseSlug := cleanSlug(seed)
	slug := baseSlug

	if !checkIsFound(slug) {
		return slug
	}

	time := time.Now().Unix()
	slug = fmt.Sprintf("%s-%d", baseSlug, time)

	if !checkIsFound(slug) {
		return slug
	}

	log.Fatal("unable to generate unique slug in timely manner")
	return ""
}

func cleanSlug(seed string) string {
	var cleanedSlug []rune
	prevDash := false

	for _, char := range seed {
		if isAllowedCharacter(char) {
			if char == ' ' {
				if !prevDash {
					cleanedSlug = append(cleanedSlug, '-')
					prevDash = true
				}
			} else {
				cleanedSlug = append(cleanedSlug, char)
				prevDash = false
			}
		}
	}

	return string(cleanedSlug)
}

func isAllowedCharacter(char rune) bool {
	return (char >= 'a' && char <= 'z') || // any char from a to z
		(char >= 'A' && char <= 'Z') || // any char from A to Z
		(char >= '0' && char <= '9') || // any char from 0 to 9
		char == '-' // allow haphin
}
