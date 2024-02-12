// package main

// import (
// 	"embed"
// 	"io/fs"
// 	"log"
// )

// //go:embed all:client/dist/client
// var frontendDist embed.FS
// //go:embed all:client/dist/server
// var serverDist embed.FS

// func Embed() (fs.FS, fs.FS) {
// 	fsysFrontend, err := fs.Sub(frontendDist, "client/dist/client")
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	fsysServer, err := fs.Sub(serverDist, "client/dist/server")

// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	return fsysFrontend, fsysServer
// }

package main

func Test() {

}
