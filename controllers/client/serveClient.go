package client

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
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
    fs := http.FileServer(http.Dir("./build"))
    return fs
  }
}
