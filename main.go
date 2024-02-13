package main

import (
<<<<<<< HEAD
=======
	"encoding/json"
>>>>>>> origin/main
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"sync"
	"time"

<<<<<<< HEAD
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
=======
	goja "github.com/dop251/goja"
	"github.com/salihdhaifullah/nexus-narrative/src/builder"
)

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func Loader(url string) Props {
	switch url {
	case "/":
		return Props{Ok: true,
			Data: Person{
				Name: "Salih Dhaifullah",
				Age:  19,
			}}
	default:
		return Props{Ok: true}
	}
}

type Props struct {
	Ok   bool        `json:"ok"`
	Data interface{} `json:"data"`
}

func MustStringfiy(data interface{}) string {
	byt, err := json.Marshal(data)
	if err != nil {
		log.Fatal(err)
	}

	return string(byt)
}

func main() {
	rendererMutex := sync.Mutex{}
	var renderer Renderer

	handel := func() {
		rendererMutex.Lock()
		renderer = NewRenderer()
		rendererMutex.Unlock()
	}

	events := builder.HandelHotReload(handel)
	builder.Build(events)
	rendererMutex.Lock()
	renderer = NewRenderer()
	rendererMutex.Unlock()

	http.Handle("/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("./build/client"))))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		log.Println("handel client runs ok")
		json := MustStringfiy(Loader(r.URL.Path))

		since := time.Now()
		rendererMutex.Lock()
		html := renderer.RenderHtml(r.URL.Path, json)
		rendererMutex.Unlock()
		log.Println(time.Since(since))

		_, err := w.Write([]byte(html))
		if err != nil {
			log.Fatal(err)
		}
>>>>>>> origin/main
	})

	log.Println("start server at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

type Renderer struct {
	RenderHtml func(string, string) string
}

func NewRenderer() Renderer {
	b, err := os.ReadFile("./build/server/script.js")
	if err != nil {
		log.Fatal(err)
	}

	rn := goja.New()
	_, err = rn.RunScript("input", string(b))
	if err != nil {
		log.Fatal(err)
	}

	var RenderHtml func(string, string) string
	err = rn.ExportTo(rn.Get("RenderHtml"), &RenderHtml)
	if err != nil {
		panic(err)
	}

	return Renderer{
		RenderHtml: RenderHtml,
	}
}
