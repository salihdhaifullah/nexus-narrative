package initializers

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func MongoDB() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO_DB_URL")).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
        log.Printf("ERROR: connecting to monogdb server %s", err)
        return
	}
    
    DB = client.Database("admin") 
	
    if err := DB.RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
        log.Printf("ERROR: pinging monogdb server %s", err)
	    return
    }

	log.Println("Pinged your deployment. You successfully connected to MongoDB!")
  }
