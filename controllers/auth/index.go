package auth

import "net/http"

func Handel() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/auth/sing-up":
			SingUp(w, r)
		case "/api/auth/login":
			Login(w, r)
		case "/api/auth/logout":
			Logout(w, r)
		}
	})
}
