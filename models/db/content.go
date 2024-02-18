package db

import (
	"errors"
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Content struct {
	ID       primitive.ObjectID `bson:"_id" validate:"required,mongodb"`
	Markdown string             `bson:"markdown" validate:"required"`
	AuthorId primitive.ObjectID `bson:"authorId" validate:"required,mongodb"`
	Images   []string           `bson:"images" validate:"dive,required,http_url"`
}

func (content Content) Validation(collection *mongo.Collection) error {
	v := validator.New(validator.WithRequiredStructEnabled())

	if err := v.Struct(content); err != nil {
		var validationErrors []string
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("field '%s': %s", err.Field(), err.Tag()))
		}
		return errors.New(strings.Join(validationErrors, "\n"))
	}

	return nil
}

func InitContent(db *mongo.Database) *mongo.Collection {
	collection := db.Collection("content")
	return collection
}
