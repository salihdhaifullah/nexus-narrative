package main

import (
	"log"
	"os"

	"github.com/gorilla/mux"
	"github.com/salihdhaifullah/nexus-narrative/controllers/client"
	"github.com/salihdhaifullah/nexus-narrative/helpers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/image_processor"
	"github.com/salihdhaifullah/nexus-narrative/helpers/initializers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/middleware"
	"github.com/salihdhaifullah/nexus-narrative/helpers/routes"
)

// TODO: setup dependency injection
func init() {
	initializers.GetENV()
}

func testUpload() []string {
	bytes, err := os.ReadFile("./client/public/404.jpg")
	if err != nil {
		log.Fatal(err)
	}

	images, err := image_processor.GenerateResizedImages(bytes, "jpg")
	if err != nil {
		log.Fatal(err)
	}

	list := []string{}

	for i := 0; i < len(images); i++ {
		list = append(list, helpers.UploadFile(images[i].Data, images[i].Name))
	}

	return list
}

func main() {
	go initializers.MongoDB()
	go helpers.InitClient()

	router := mux.NewRouter()
	router.Use(middleware.Gzip)

	api := router.PathPrefix("/api").Subrouter()
	api.PathPrefix("/auth/").HandlerFunc(routes.HandelRoutes())

	clientRoute := router.PathPrefix("/").Subrouter()
	clientRoute.Use(middleware.Cache)
	clientRoute.Methods("GET").Handler(client.HandelClient())

	initializers.Listen(router)
}
