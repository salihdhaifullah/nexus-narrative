package initializers

import (
	"context"
	"log"
	"os"

	"github.com/salihdhaifullah/golang-web-app-setup/models"
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

	CategoryModel = models.InitCategory(DB)
	ViewModel = models.InitView(DB)
	UserModel = models.InitUser(DB)
	ReactionModel = models.InitReaction(DB)
	CommentModel = models.InitComment(DB)
	TagModel = models.InitTag(DB)
	ContentModel = models.InitContent(DB)
	PostModel = models.InitPost(DB)
}
