package initializers

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func Listen() {
	var port string = "8080"

	if len(os.Getenv("PORT")) > 1 {
		port = os.Getenv("PORT")
	}

	addr := ":" + port

	if os.Getenv("PRODUCTION") == "true"  {
		fmt.Printf("App Running In Production, Port: %s\n\n", port)
	} else {
		fmt.Printf("App listen in \"http://localhost:%s\"\n\n", port)
	}

	log.Fatal(http.ListenAndServe(addr, nil))
}
