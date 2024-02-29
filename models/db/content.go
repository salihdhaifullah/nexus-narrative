package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Content struct {
	ID       primitive.ObjectID `bson:"_id" validate:"required,mongodb"`
	Markdown string             `bson:"markdown" validate:"required"`
	AuthorId primitive.ObjectID `bson:"authorId" validate:"required,mongodb"`
	Images   []string           `bson:"images" validate:"dive,required,http_url"`
}

func InitContent(db *mongo.Database) *mongo.Collection {
	collection := db.Collection("content")
	return collection
}
