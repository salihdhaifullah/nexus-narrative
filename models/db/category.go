package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)


type Category struct {
	ID    *primitive.ObjectID  `bson:"_id,omitempty"`
	Name  string               `bson:"name" validate:"required,min=2,max=50"`
	Posts []primitive.ObjectID `bson:"posts"`
}

func (category Category) Insert(collection *mongo.Collection) error {
	v := validator.New(validator.WithRequiredStructEnabled())
	if err := v.Struct(category); err != nil {
		var validationErrors []string
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("field '%s': %s", err.Field(), err.Tag()))
		}
		return errors.New(strings.Join(validationErrors, "\n"))
	}

	inserted, err := collection.InsertOne(context.Background(), category)
	if err != nil {
		log.Fatal(err)
	}

	category.ID = inserted.InsertedID.(*primitive.ObjectID)
	return nil
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
