package helpers

import (
	"net/http"
	"time"
)

func SetCookie(id uint, w http.ResponseWriter) {
	cookie := http.Cookie{
		Name:     "token",
		Value:    NewToken(int(id)),
		Path:     "/",
		MaxAge:   int(time.Now().Add(time.Duration(time.Now().Year())).UTC().Unix()),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}

	http.SetCookie(w, &cookie)
}
