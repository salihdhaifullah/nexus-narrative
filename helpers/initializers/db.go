package initializers

import (
	"context"
	"log"
	"os"

	"github.com/salihdhaifullah/nexus-narrative/models/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var PostModel *mongo.Collection
var ContentModel *mongo.Collection
var TagModel *mongo.Collection
var CommentModel *mongo.Collection
var ReactionModel *mongo.Collection
var UserModel *mongo.Collection
var ViewModel *mongo.Collection
var CategoryModel *mongo.Collection

var DB *mongo.Database

func MongoDB() {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO_DB_URL")).SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.TODO(), opts)

	if err != nil {
		log.Printf("ERROR: connecting to monogdb server %s", err)
		return
	}

	DB = client.Database("nexus-narrative")

	if err := DB.RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Err(); err != nil {
		log.Printf("ERROR: pinging monogdb server %s", err)
		return
	}

	log.Println("Pinged your deployment. You successfully connected to MongoDB!")

	CategoryModel = db.InitCategory(DB)
	ViewModel = db.InitView(DB)
	UserModel = db.InitUser(DB)
	ReactionModel = db.InitReaction(DB)
	CommentModel = db.InitComment(DB)
	TagModel = db.InitTag(DB)
	ContentModel = db.InitContent(DB)
	PostModel = db.InitPost(DB)
}
