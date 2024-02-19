package main

import (
	"github.com/gorilla/mux"
	"github.com/salihdhaifullah/nexus-narrative/controllers/client"
	"github.com/salihdhaifullah/nexus-narrative/helpers/initializers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/middleware"
	"github.com/salihdhaifullah/nexus-narrative/helpers/routes"
)

// TODO: setup dependency injection
func init() {
	initializers.GetENV()
}

func main() {
	go initializers.MongoDB()

	router := mux.NewRouter()
	router.Use(middleware.Gzip)

	api := router.PathPrefix("/api").Subrouter()
	api.PathPrefix("/auth/").HandlerFunc(routes.HandelRoutes())

	clientRoute := router.PathPrefix("/").Subrouter()
	clientRoute.Use(middleware.Cache)
	clientRoute.Methods("GET").Handler(client.HandelClient())

  initializers.Listen(router)
}
