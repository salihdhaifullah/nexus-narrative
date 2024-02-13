package middleware

import (
	"net/http"

<<<<<<< HEAD:helpers/middleware/auth.go
	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
=======
	"github.com/dgrijalva/jwt-go"
	"github.com/salihdhaifullah/nexus-narrative/helpers"
>>>>>>> origin/main:src/helpers/middleware/auth.go
)

func Authorized(next func(w http.ResponseWriter, r *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("User is UnAuthorized"))
			return
		}
		_, err = helpers.Decode(cookie.Value)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("User is UnAuthorized"))
			return
		}

		next(w, r)
	})
}
