package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Category struct {
	ID    primitive.ObjectID   `bson:"_id,omitempty"`
	Name  string               `bson:"name" validate:"required,min=2,max=50"`
	Posts []primitive.ObjectID `bson:"posts"`
}

func InitCategory(db *mongo.Database) *mongo.Collection {
	collection := db.Collection("category")

	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "name", Value: 1}},
		Options: options.Index().SetUnique(true),
	}

	createIndex(collection, indexModel)
	return collection
}
