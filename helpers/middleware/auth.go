package middleware

import (
	"net/http"

	"github.com/salihdhaifullah/nexus-narrative/helpers"
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
