package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)



type Post struct {
	DBModel
	ID                 primitive.ObjectID   `bson:"_id"`
	Title              string               `bson:"title"`
	Slug               string               `bson:"slug"`
	BackgroundImageUrl string               `bson:"background_image_url"`
	ContentID          primitive.ObjectID   `bson:"content_id"`
	AuthorID           primitive.ObjectID   `bson:"author_id"`
	CategoryID         primitive.ObjectID   `bson:"category_id"`
	CreatedAt          primitive.DateTime   `bson:"created_at"`
	Tags               []primitive.ObjectID `bson:"tags"`
	Comments           []primitive.ObjectID `bson:"comments"`
	Reactions          []primitive.ObjectID `bson:"reactions"`
	Views              []primitive.ObjectID `bson:"views"`
}

func InitPost(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("post")

    indexModel := mongo.IndexModel{
        Keys:    bson.D{{Key: "slug", Value: 1}},
        Options: options.Index().SetUnique(true),
    }

    createIndex(collection, indexModel)

    indexModel = mongo.IndexModel{
        Keys:    bson.D{{Key: "title", Value: 1}},
        Options: options.Index(),
    }

    createIndex(collection, indexModel)
    return collection
}


