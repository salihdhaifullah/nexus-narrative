package helpers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/storage"

	"google.golang.org/api/option"
)

var storageClient *storage.Client

func InitClient() {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./credentials.json")
	app, err := firebase.NewApp(ctx, &firebase.Config{StorageBucket: "blog-de6f1.appspot.com"}, opt)

	if err != nil {
		log.Fatalf("Error initializing Firebase app: %v\n", err)
	}

	storageClient, err = app.Storage(ctx)
	if err != nil {
		log.Fatalf("Error initializing Cloud Storage client: %v\n", err)
	}
}

func UploadFile(data []byte, name string) string {
	bucket, err := storageClient.DefaultBucket()
	if err != nil {
		log.Fatal(err)
	}

	object := bucket.Object(name)
	writer := object.NewWriter(context.Background())
	defer writer.Close()

	if _, err := io.Copy(writer, bytes.NewReader(data)); err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("%s/%s", object.BucketName(), object.ObjectName())
}
