package helpers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/storage"
	"github.com/google/uuid"

	"google.golang.org/api/option"
)

// TODO: use proper error management and recovery
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

	token := uuid.New().String()
	writer.Metadata = map[string]string{"firebaseStorageDownloadTokens": token}

	if _, err := io.Copy(writer, bytes.NewReader(data)); err != nil {
		log.Fatal(err)
	}

	return fmt.Sprintf("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media&token=%s", object.BucketName(), object.ObjectName(), token)
}
