package models

import (
	"context"
	"log"

	"github.com/salihdhaifullah/golang-web-app-setup/models/enums"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func createIndex(collection *mongo.Collection, indexModel mongo.IndexModel) {
    _, err := collection.Indexes().CreateOne(context.Background(), indexModel)
    if err != nil {
        if mongoErr, ok := err.(mongo.CommandError); ok && mongoErr.Code == 85 {
            log.Println("Index already exists")
        } else {
            log.Fatal(err)
        }
    } else {
        log.Println("Index created successfully")
    }
}


type Category struct {
	ID    primitive.ObjectID   `bson:"_id"`
	Name  string               `bson:"name"`
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

type Tag struct {
	ID    primitive.ObjectID   `bson:"_id"`
	Name  string               `bson:"name"`
	Posts []primitive.ObjectID `bson:"posts"`
}

func InitTag(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("tag") 

    indexModel := mongo.IndexModel{
        Keys:    bson.D{{Key: "name", Value: 1}},
        Options: options.Index().SetUnique(true),
    }

    createIndex(collection, indexModel)
    return collection
}

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

type View struct {
	ID        primitive.ObjectID `bson:"_id"`
	IPAddress string             `bson:"ip_address"`
	PostID    primitive.ObjectID `bson:"post_id"`
	CreatedAt primitive.DateTime `bson:"created_at"`
}

func InitView(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("view") 

    indexModel := mongo.IndexModel{
        Keys:    bson.D{
            {Key: "ip_address", Value: 1},
            {Key: "post_id", Value: 1},
        },
        Options: options.Index().SetUnique(true),
    }

    createIndex(collection, indexModel)
    return collection
}

type Content struct {
	ID       primitive.ObjectID `bson:"_id"`
	Markdown string             `bson:"markdown"`
	AuthorId primitive.ObjectID `bson:"authorId"`
	Images   []string           `bson:"images"`
}

func InitContent(db *mongo.Database) *mongo.Collection {
    collection := db.Collection("content") 
    return collection
}

type Post struct {
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


type User struct {
	ID           primitive.ObjectID   `bson:"_id"`
	Email        string               `bson:"email"`
	LastName     string               `bson:"last_name"`
	FirstName    string               `bson:"first_name"`
	PasswordHash string               `bson:"password_hash"`
	AvatarUrl    string               `bson:"avatar_url"`
	JoinedAt     primitive.DateTime   `bson:"joined_at"`
	Blog         string               `bson:"blog"`
	Bio          string               `bson:"bio"`
	ProfileID    primitive.ObjectID   `bson:"profile_ID"`
	Comments     []primitive.ObjectID `bson:"comments"`
	Reactions    []primitive.ObjectID `bson:"reactions"`
	Posts        []primitive.ObjectID `bson:"posts"`
	Contents     []primitive.ObjectID `bson:"contents"`
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

