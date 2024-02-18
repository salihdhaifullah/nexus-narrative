package db

import (
	"github.com/salihdhaifullah/nexus-narrative/models/enums"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)




type Reaction struct {
	ID     primitive.ObjectID `bson:"_id"`
	PostID primitive.ObjectID `bson:"post_id"`
	UserID primitive.ObjectID `bson:"user_id"`
	Type   enums.Reactions    `bson:"type"`
}

func InitReaction(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("reaction")

    indexModel := mongo.IndexModel{
        Keys:    bson.D{{Key: "type", Value: 1}},
        Options: options.Index(),
    }

    createIndex(collection, indexModel)
    return collection
}

