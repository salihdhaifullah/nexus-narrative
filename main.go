package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"sync"

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

var isProduction = true

var Blog *template.Template
var NotFound *template.Template
var Login *template.Template
var Home *template.Template
var AccountVerification *template.Template
var ForgatPassword *template.Template
var ResetPassword *template.Template
var SingUp *template.Template

func initViews() {
	Blog = template.Must(template.Must(template.ParseFiles("./views/blog.html")).ParseGlob("./views/layout/*.html"))
	NotFound = template.Must(template.Must(template.ParseFiles("./views/404.html")).ParseGlob("./views/layout/*.html"))
	Home = template.Must(template.Must(template.ParseFiles("./views/home.html")).ParseGlob("./views/layout/*.html"))
	Login = template.Must(template.Must(template.ParseFiles("./views/auth/login.html")).ParseGlob("./views/layout/*.html"))
	AccountVerification = template.Must(template.Must(template.ParseFiles("./views/auth/account-verification.html")).ParseGlob("./views/layout/*.html"))
	ForgatPassword = template.Must(template.Must(template.ParseFiles("./views/auth/forgat-password.html")).ParseGlob("./views/layout/*.html"))
	ResetPassword = template.Must(template.Must(template.ParseFiles("./views/auth/reset-password.html")).ParseGlob("./views/layout/*.html"))
	SingUp = template.Must(template.Must(template.ParseFiles("./views/auth/sing-up.html")).ParseGlob("./views/layout/*.html"))
}

func init() {
	initViews()
	initializers.GetENV()
	isProduction = os.Getenv("ENV") == "PROD"
}

func (this View) Send(t *template.Template) {
	err := t.Execute(this.w, this.data)

	if err != nil {
		log.Fatal(err)
	}
}

type View struct {
	w http.ResponseWriter
	data interface{}
}

func initView(w http.ResponseWriter, data interface{}) *View {
	if !isProduction {
		// to reload the html files
		initViews()
	}

	return &View{w: w, data: data}
}


func LoginHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(Login)
}

func SingUpHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(SingUp)
}

func AccountVerificationHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(AccountVerification)
}

func ResetPasswordHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(ResetPassword)

}

func ForgatPasswordHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(ForgatPassword)
}


func HomeHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(Home)
}


func BlogHandler(w http.ResponseWriter, r *http.Request) {
	data := User{
		Id:        "1",
		Blog:      mux.Vars(r)["blog"],
		AvatarUrl: "https://templ.guide/img/logo.svg",
		Name:      "salih dhaifullah",
	}

	initView(w, data).Send(Blog)
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	initView(w, nil).Send(NotFound)
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
	router.Use(CacheMiddleware)
	router.Use(middleware.Gzip)

	router.NotFoundHandler = http.HandlerFunc(NotFoundHandler)

	router.HandleFunc("/", HomeHandler).Methods("GET")
    router.HandleFunc("/{blog}", BlogHandler).Methods("GET")
	router.PathPrefix("/static").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static")))).Methods("GET")

	authRouter := router.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/login", LoginHandler).Methods("GET")
	authRouter.HandleFunc("/account-verification", AccountVerificationHandler).Methods("GET")
	authRouter.HandleFunc("/reset-password", ResetPasswordHandler).Methods("GET")
	authRouter.HandleFunc("/forgat-password", ForgatPasswordHandler).Methods("GET")
	authRouter.HandleFunc("/sing-up", SingUpHandler).Methods("GET")


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
