package db

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)


func createIndex(collection *mongo.Collection, indexModel mongo.IndexModel) {
    _, err := collection.Indexes().CreateOne(context.Background(), indexModel)
    if err != nil {
        if mongoErr, ok := err.(mongo.CommandError); ok && mongoErr.Code == 85 {
            log.Println("Index already exists")
        } else {
            log.Fatal(err)
        }
    } else {
        log.Println("Index created successfully")
    }
}
