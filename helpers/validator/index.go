package validator

import (
	"fmt"
	"net/http"
	"net/mail"

	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
)

func IsNotEmail(email string, w http.ResponseWriter) bool {

	if len(email) < 1 {
		helpers.BadRequest("No Email Found", w)
		return true
	}

	_, err := mail.ParseAddress(email)

	if err != nil {
		helpers.BadRequest("UnValid Email Address", w)
		return true
	}

	return false
}

func IsNotLen(short int, long int, v string, name string, w http.ResponseWriter) bool {
	length := len(v)

	if length < 1 {
		helpers.BadRequest(fmt.Sprintf("No %s Found", name), w)
		return true
	}

	if length >= long {
		helpers.BadRequest(fmt.Sprintf("%s Is To Long", name), w)
		return true
	}

	if length <= short {
		helpers.BadRequest(fmt.Sprintf("%s Is To Short", name), w)
		return true
	}

	return false
}
