package routes

import (
	"net/http"

	"github.com/salihdhaifullah/nexus-narrative/controllers/auth"
)


func HandelRoutes() {
	http.HandleFunc("/api/auth/sing-up/", auth.SingUp)
	http.HandleFunc("/api/auth/login/", auth.Login)
	http.HandleFunc("/api/auth/logout/", auth.Logout)
}

