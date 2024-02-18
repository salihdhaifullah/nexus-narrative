package repository

import (
	"github.com/salihdhaifullah/nexus-narrative/models/db"
	"github.com/salihdhaifullah/nexus-narrative/models/dto"
	"go.mongodb.org/mongo-driver/bson/primitive"
)



func InsertUser(dto dto.SingUp) db.User {
	blogName := "" // TODO: make function that generate slug based on some seed
	avatarUrl := "" // TODO: function that generate image and upload the image to supabase
	contentID := primitive.NewObjectID() // TODO create content document
	userID := primitive.NewObjectID() // TODO create user document
	passwordHash := "" // hash the password and combined it with the salt


}
