package db

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID           primitive.ObjectID   `bson:"_id" validate:"required" json:"_id"`
	Email        string               `bson:"email" validate:"required,email" json:"email"`
	LastName     string               `bson:"last_name" validate:"required,min=2,max=75" json:"lastName"`
	FirstName    string               `bson:"first_name" validate:"required,min=2,max=75" json:"firstName"`
	PasswordHash string               `bson:"password_hash" validate:"required" json:"-"`
	AvatarUrl    string               `bson:"avatar_url" validate:"required,http_url" json:"avatarUrl"`
	JoinedAt     time.Time            `bson:"joined_at" validate:"required" json:"joinedAt"`
	Blog         string               `bson:"blog" validate:"required,hostname_rfc1123" json:"blog"`
	Bio          string               `bson:"bio" validate:"max=250" json:"bio"`
	ProfileID    primitive.ObjectID   `bson:"profile_ID" validate:"required" json:"profileId"`
	Comments     []primitive.ObjectID `bson:"comments" json:"-"`
	Reactions    []primitive.ObjectID `bson:"reactions" json:"-"`
	Posts        []primitive.ObjectID `bson:"posts" json:"-"`
	Contents     []primitive.ObjectID `bson:"contents" json:"-"`
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
