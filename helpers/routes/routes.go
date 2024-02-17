package routes

import (
	"net/http"

	"github.com/salihdhaifullah/golang-web-app-setup/controllers/auth"
)

func HandelRoutes() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/auth/sing-up":
			auth.SingUp(w, r)
		case "/api/auth/login":
			auth.Login(w, r)
		case "/api/auth/logout":
			auth.Logout(w, r)
		}
	})
}
