package client

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
)

func initProxy() {
	viteServer := "http://localhost:5173"

	target, err := url.Parse(viteServer)
	if err != nil {
		log.Fatal("Error parsing target URL:", err)
	}

	proxy = httputil.NewSingleHostReverseProxy(target)
}

var proxy *httputil.ReverseProxy
var isFirst = true

func HandelClient() http.Handler {
	if os.Getenv("ENV") != "PROD" {
		if isFirst {
			isFirst = false
			initProxy()
		}
		return proxy
	} else {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			staticPath, err := filepath.Abs("./build")
			if err != nil {
				log.Fatal("Error parsing static path:", err)
			}

			path := filepath.Join(staticPath, r.URL.Path)
			fi, err := os.Stat(path)

			if os.IsNotExist(err) || fi.IsDir() {
				http.ServeFile(w, r, filepath.Join(staticPath, "index.html"))
				return
			}

			if err != nil {
				log.Printf("error something went wrong the error is %s\n", err.Error())
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			http.FileServer(http.Dir(staticPath)).ServeHTTP(w, r)
		})
	}
}
