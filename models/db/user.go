package db

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


type User struct {
	DBModel
	ID           primitive.ObjectID   `bson:"_id" validate:"required,mongodb"`
	Email        string               `bson:"email" validate:"required,email"`
	LastName     string               `bson:"last_name" validate:"required,min=2,max=75"`
	FirstName    string               `bson:"first_name" validate:"required,min=2,max=75"`
	PasswordHash string               `bson:"password_hash" validate:"required"`
	AvatarUrl    string               `bson:"avatar_url" validate:"required,http_url"`
	JoinedAt     primitive.DateTime   `bson:"joined_at" validate:"required"`
	Blog         string               `bson:"blog" validate:"required,hostname_rfc1123"`
	Bio          string               `bson:"bio" validate:"max=250,omitempty"`
	ProfileID    primitive.ObjectID   `bson:"profile_ID" validate:"required,mongodb"`
	Comments     []primitive.ObjectID `bson:"comments" validate:"dive,mongodb"`
	Reactions    []primitive.ObjectID `bson:"reactions" validate:"dive,mongodb"`
	Posts        []primitive.ObjectID `bson:"posts" validate:"dive,mongodb"`
	Contents     []primitive.ObjectID `bson:"contents" validate:"dive,mongodb"`
}



func InitUser(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("user")

    indexModel := mongo.IndexModel{
        Keys:    bson.D{{Key: "email", Value: 1}},
        Options: options.Index().SetUnique(true),
    }

    createIndex(collection, indexModel)
    return collection
}
