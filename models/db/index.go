package db

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
)

func createIndex(collection *mongo.Collection, indexModel mongo.IndexModel) {
	_, err := collection.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Fatal(err)
	}
}

func ValidationDB(model interface{}) error {
	v := validator.New(validator.WithRequiredStructEnabled())

	if err := v.Struct(model); err != nil {
		var validationErrors []string
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("field '%s': %s", err.Field(), err.Tag()))
		}
		return errors.New(strings.Join(validationErrors, "\n"))
	}

	return nil
}
