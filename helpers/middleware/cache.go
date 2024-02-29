package middleware

import (
	"net/http"
	"os"
)

func Cache(next http.Handler) http.Handler {
	if os.Getenv("ENV") == "DEV" {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
			next.ServeHTTP(w, r)
		})
	} else {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "public, max-age=2592000") // 30 days
			next.ServeHTTP(w, r)
		})
	}
}
