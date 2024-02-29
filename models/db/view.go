package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type View struct {
	ID        primitive.ObjectID `bson:"_id"`
	IPAddress string             `bson:"ip_address"`
	PostID    primitive.ObjectID `bson:"post_id"`
	CreatedAt primitive.DateTime `bson:"created_at"`
}

func InitView(db *mongo.Database) *mongo.Collection {
	collection := db.Collection("view")

	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "ip_address", Value: 1},
			{Key: "post_id", Value: 1},
		},
		Options: options.Index().SetUnique(true),
	}

	createIndex(collection, indexModel)
	return collection
}
