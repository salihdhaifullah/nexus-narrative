package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/salihdhaifullah/nexus-narrative/helpers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/initializers"
	"github.com/salihdhaifullah/nexus-narrative/helpers/repository"
	"github.com/salihdhaifullah/nexus-narrative/models/dto"
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
		helpers.BadRequest(nil, "No Data Found In Request", w)
		return
	}

	var SingUpDto dto.SingUp

	err = json.Unmarshal(bytes, &SingUpDto)
	if err != nil {
		helpers.BadRequest(nil, "Invalid Type Of Request Data", w)
		return
	}

	errs := dto.ValidationDTO(SingUpDto)
	if len(errs) != 0 {
		helpers.BadRequest(errs, "err", w)
		return
	}

	err = initializers.UserModel.FindOne(context.Background(), bson.M{"email": SingUpDto.Email}).Err()
	isFound := true
	if err != nil {
		if err == mongo.ErrNoDocuments {
			isFound = false
		} else {
			log.Fatal(err)
		}
	}

	if isFound {
		helpers.BadRequest(nil, "User With This Email is Already Exists Try Login", w)
		return
	}

	user := repository.InsertUser(SingUpDto)

	helpers.SetCookie(user.ID.String(), w)
	helpers.Created(&user, "Successfully Sing Up", w)
}

func Login(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)

	if r.Body == nil || err != nil {
		helpers.BadRequest(nil, "No Data Found In Request", w)
		return
	}

	// need data validation
	var data dto.Login
	err = json.Unmarshal(bytes, &data)

	if err != nil {
		helpers.BadRequest(nil, "Invalid Type Of Request Data", w)
		return
	}

	user := User{}

	err = initializers.UserModel.FindOne(context.Background(), bson.M{"email": data.Email}).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			helpers.BadRequest(nil, fmt.Sprintf("User With This Email \"%s\" is Not Exists Try SingUp", data.Email), w)
			return
		} else {
			log.Fatal(err)
		}
	}

	err = helpers.ComparePassword(user.Password, data.Password)

	if err != nil {
		helpers.BadRequest(nil, "Password Or Email Is Wrong Try Again", w)
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
