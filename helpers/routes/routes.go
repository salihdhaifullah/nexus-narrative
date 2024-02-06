package routes

import (
	"net/http"

	"github.com/salihdhaifullah/golang-web-app-setup/controllers/auth"
)


func HandelRoutes() {
	http.HandleFunc("/api/auth/sing-up/", auth.SingUp)
	http.HandleFunc("/api/auth/login/", auth.Login)
	http.HandleFunc("/api/auth/logout/", auth.Logout)
}

