package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"

	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/initializers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/middleware"
)

// var isProduction = true
func init() {
	initializers.GetENV()
	// isProduction = os.Getenv("ENV") == "PROD"
}

func main() {
	wg := sync.WaitGroup{}
	go helpers.WaitFor(initializers.MongoDB, &wg)

	viteServer := "http://localhost:5173"

	target, err := url.Parse(viteServer)
	if err != nil {
		log.Fatal("Error parsing target URL:", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	router := http.NewServeMux()
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})

	// router.Handle("/static", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	http.Handle("/", CacheMiddleware(middleware.Gzip(router)))
	initializers.Listen(router)
}


func CacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		next.ServeHTTP(w, r)
	})
}
