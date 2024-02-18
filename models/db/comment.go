package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)



type Comment struct {
	ID        primitive.ObjectID `bson:"_id"`
	CreatedAt primitive.DateTime `bson:"created_at"`
	Content   string             `bson:"content"`
	AuthorID  primitive.ObjectID `bson:"author_id"`
	PostID    primitive.ObjectID `bson:"post_id"`
}

func InitComment(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("comment")
    return collection
}


