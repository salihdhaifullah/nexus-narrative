package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/salihdhaifullah/nexus-narrative/helpers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/image_processor"
	"github.com/salihdhaifullah/nexus-narrative/helpers/initializers"
	"github.com/salihdhaifullah/nexus-narrative/models/db"
	"github.com/salihdhaifullah/nexus-narrative/models/dto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// InsertUser it insert new user to database
// and will break the app if data is not valid
func InsertUser(dto dto.SingUp) db.User {
	seed := fmt.Sprintf("%s-%s", dto.FirstName, dto.LastName)
	chuckIsFound := func(slug string) bool {
		err := initializers.UserModel.FindOne(context.Background(), bson.M{"blog": slug}).Err()
		isFound := true
		if err != nil {
			if err == mongo.ErrNoDocuments {
				isFound = false
			} else {
				log.Fatal(err)
			}
		}
		return isFound
	}

	blogName := helpers.GenerateSlug(seed, chuckIsFound)
	avatarUrl := image_processor.CreateAvatar()
	contentID := primitive.NewObjectID()
	userID := primitive.NewObjectID()
	passwordHash := helpers.HashPassword(dto.Password)

	content := db.Content{
		ID:       contentID,
		AuthorId: userID,
	}

	err := db.ValidationDB(content)
	if err != nil {
		log.Fatal(err)
	}

	user := db.User{
		ID:           userID,
		ProfileID:    contentID,
		Email:        dto.Email,
		FirstName:    dto.FirstName,
		LastName:     dto.LastName,
		PasswordHash: passwordHash,
		JoinedAt:     time.Now(),
		AvatarUrl:    avatarUrl,
		Blog:         blogName,
	}

	err = db.ValidationDB(user)
	if err != nil {
		log.Fatal(err)
	}

	_, err = initializers.UserModel.InsertOne(context.Background(), user)
	if err != nil {
		log.Fatal(err)
	}

	log.Println(user.AvatarUrl)

	return user
}

func CheckIsUserFoundByEmail(email string) bool {
	err := initializers.UserModel.FindOne(context.Background(), bson.M{"email": email}).Err()
	isFound := true
	if err != nil {
		if err == mongo.ErrNoDocuments {
			isFound = false
		} else {
			log.Fatal(err)
		}
	}

	return isFound
}
