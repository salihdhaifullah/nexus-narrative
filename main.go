package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/initializers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/middleware"
)

type User struct {
	Id        string
	Name      string
	Blog      string
	AvatarUrl string
}

type View struct {
	Year  string
	Title string
	Theme string
	Script bool
	User  User
}

var Temp *template.Template
var isProduction = true

func init() {
	initializers.GetENV()
	temp, err := template.ParseGlob("./views/*.html")
	Temp = temp

	if err != nil {
		log.Fatal(err)
	}

	isProduction = os.Getenv("ENV") == "PROD"
}

// BUG: cant serve static files from "/"

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	data := View{
		Year:  fmt.Sprint(time.Now().Year()),
		Title: "test title",
		Theme: "dark",
		User: User{
			Id:        "1",
			Blog:      "SD-DEV",
			AvatarUrl: "https://templ.guide/img/logo.svg",
			Name:      "salih dhaifullah",
		},
	}

	SendView(w, data, "index")
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	data := View{
		Year:  fmt.Sprint(time.Now().Year()),
		Title: "test title",
		Theme: "dark",
		User: User{
			Id:        "1",
			Blog:      "SD-DEV",
			AvatarUrl: "https://templ.guide/img/logo.svg",
			Name:      "salih dhaifullah",
		},
	}

	SendView(w, data, "login")
}

func BlogHandler(w http.ResponseWriter, r *http.Request) {
	data := View{
		Year:  fmt.Sprint(time.Now().Year()),
		Title: "test title",
		Theme: "dark",
		Script: true,
		User: User{
			Id:        "1",
			Blog:      mux.Vars(r)["blog"],
			AvatarUrl: "https://templ.guide/img/logo.svg",
			Name:      "salih dhaifullah",
		},
	}

	SendView(w, data, "blog")
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	data := View{
		Year:  fmt.Sprint(time.Now().Year()),
		Title: "test title",
		Theme: "dark",
		User: User{
			Id:        "1",
			Blog:      "test",
			AvatarUrl: "https://templ.guide/img/logo.svg",
			Name:      "salih dhaifullah",
		},
	}

	SendView(w, data, "404")
}


func main() {
	wg := sync.WaitGroup{}

	wg.Add(1)
	go helpers.WaitFor(initializers.MongoDB, &wg)
	if isProduction {
		wg.Add(1)
		go helpers.WaitFor(helpers.Build, &wg)
	}
	wg.Wait()

	router := mux.NewRouter()
	router.NotFoundHandler = http.HandlerFunc(NotFoundHandler)
	http.Handle("/", middleware.Gzip(router))

	router.HandleFunc("/", HomeHandler).Methods("GET")
    router.HandleFunc("/login", LoginHandler).Methods("GET")
    router.HandleFunc("/{blog}", BlogHandler).Methods("GET")
	router.PathPrefix("/static").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static")))).Methods("GET")

	initializers.Listen()
}

func SendView(w http.ResponseWriter, data interface{}, name string) {
	if isProduction {
		err := Temp.ExecuteTemplate(w, name, data)

		if err != nil {
			log.Fatal(err)
		}
	} else {
		Temp, err := template.ParseGlob("./views/*.html")

		if err != nil {
			log.Fatal(err)
		}

		err = Temp.ExecuteTemplate(w, name, data)

		if err != nil {
			log.Fatal(err)
		}
	}
}



