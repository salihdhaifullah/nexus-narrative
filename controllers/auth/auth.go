package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/initializers"
	"github.com/salihdhaifullah/golang-web-app-setup/models/dto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	Email     string             `json:"email"`
	FirstName string             `json:"firstName"`
	LastName  string             `json:"lastName"`
	Password  string             `json:"-"`
}


func SingUp(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)

	if r.Body == nil || err != nil {
		helpers.BadRequest("No Data Found In Request", w)
		return
	}

	var data dto.SingUp
	// need data valdtion
	err = json.Unmarshal(bytes, &data)

	if err != nil {
		helpers.BadRequest("Invalid Type Of Request Data", w)
		return
	}

	err = initializers.DB.Collection("users").FindOne(context.Background(), bson.M{"email": data.Email}).Err()
	isFound := true
	if err != nil {
		if err == mongo.ErrNoDocuments {
			isFound = false
		} else {
			log.Fatal(err)
		}
	}

	if isFound {
		helpers.BadRequest(fmt.Sprintf("User With This Email \"%s\" is Already Exists Try Login", data.Email), w)
		return
	}


  
	// hash password
	hash := helpers.HashPassword(data.Password)

	// create account
    user := User{
        ID: primitive.NewObjectID(),
        Password:  hash,
		Email:     data.Email,
		FirstName: data.FirstName,
		LastName:  data.LastName,
	}

    _, err = initializers.DB.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
			log.Fatal(err)
	}

	helpers.SetCookie(user.ID.String(), w)
	helpers.Created(&user, "Successfully Sing Up", w)
}

func Login(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)

	if r.Body == nil || err != nil {
		helpers.BadRequest("No Data Found In Request", w)
		return
	}

	// need data valdtion
	var data dto.Login
	err = json.Unmarshal(bytes, &data)

	if err != nil {
		helpers.BadRequest("Invalid Type Of Request Data", w)
		return
	}

    user := User{}

	err = initializers.DB.Collection("users").FindOne(context.Background(), bson.M{"email": data.Email}).Decode(&user)
	
    if err != nil {
	    if err == mongo.ErrNoDocuments {
		helpers.BadRequest(fmt.Sprintf("User With This Email \"%s\" is Not Exists Try SingUp", data.Email), w)
		return
        } else {
            log.Fatal(err)
        }
    }

	err = helpers.ComparePassword(user.Password, data.Password)

	if err != nil {
		helpers.BadRequest("Password Or Email Is Wrong Try Again", w)
		return
	}


	helpers.SetCookie(user.ID.String(), w)
	helpers.Ok(user, "Successfully Login", w)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}

	http.SetCookie(w, cookie)

	helpers.Ok(nil, "Successfully Logout", w)
}
