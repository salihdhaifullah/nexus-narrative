package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/salihdhaifullah/golang-web-app-setup/helpers/initializers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/middleware"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/routes"
    "github.com/gorilla/mux" 
)

// var isProduction = true
func init() {
	initializers.GetENV()
	// isProduction = os.Getenv("ENV") == "PROD"
}

func main() {
	go initializers.MongoDB()
    viteServer := "http://localhost:5173"
  
	target, err := url.Parse(viteServer)
	if err != nil {
		log.Fatal("Error parsing target URL:", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

    router := mux.NewRouter()	
    router.Use(CacheMiddleware)

    api := router.PathPrefix("/api").Subrouter()
    api.PathPrefix("/auth/").HandlerFunc(routes.HandelRoutes())
    
    client := router.PathPrefix("/").Subrouter().Methods("GET")
    client.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		proxy.ServeHTTP(w, r)
	})


	http.Handle("/", middleware.Gzip(router))
	initializers.Listen()
}


func CacheMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		next.ServeHTTP(w, r)
	})
}
