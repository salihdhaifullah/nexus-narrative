package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/salihdhaifullah/golang-web-app-setup/helpers"
	"github.com/salihdhaifullah/golang-web-app-setup/helpers/validator"
	"github.com/salihdhaifullah/golang-web-app-setup/models/dto"
)


type User struct {
	ID        uint   `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}


func SingUp(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)

	if r.Body == nil || err != nil {
		helpers.BadRequest("No Data Found In Request", w)
		return
	}

	// check if data is formatted correctly
	var data dto.SingUp

	err = json.Unmarshal(bytes, &data)

	if err != nil  {
		helpers.BadRequest("Invalid Type Of Request Data", w)
		return
	}

	if validator.IsNotEmail(*data.Email, w) {
		return
	}

	if validator.IsNotLen(2, 60, *data.FirstName, "FirstName", w) {
		return
	}

	if validator.IsNotLen(2, 60, *data.LastName, "LastName", w) {
		return
	}

	if validator.IsNotLen(8, 60, *data.Password, "Password", w) {
		return
	}

	var isFound struct {
		ID *int
	}

	// initializers.DB.Raw("SELECT id FROM users WHERE email = ?", *data.Email).Scan(&isFound)
	// TODO: use mongoDB
	if isFound.ID != nil {
		helpers.BadRequest(fmt.Sprintf("User With This Email \"%s\" is Already Exists Try Login", *data.Email), w)
		return
	}

	// hash password
	// hash := helpers.HashPassword(*data.Password)

	// create account
	var user User

	// TODO: use mongoDB
	// initializers.DB.Create(&models.User{
		// Password:  hash,
		// Email:     *data.Email,
		// FirstName: *data.FirstName,
		// LastName:  *data.LastName,
	// }).Select("ID", "Email", "FirstName", "LastName").Scan(&user)

	helpers.SetCookie(user.ID, w)

	helpers.Created(&user, "Successfully Sing Up", w)
}



func Login(w http.ResponseWriter, r *http.Request) {
	bytes, err := io.ReadAll(r.Body)

	if r.Body == nil || err != nil {
		helpers.BadRequest("No Data Found In Request", w)
		return
	}

	// check if data is formatted correctly
	var data dto.Login
	err = json.Unmarshal(bytes, &data)

	if err != nil {
		helpers.BadRequest("Invalid Type Of Request Data", w)
		return
	}

	if validator.IsNotEmail(*data.Email, w) {
		return
	}

	if validator.IsNotLen(8, 60, *data.Password, "Password", w) {
		return
	}

	var isFound struct {
		ID        *uint
		Password  *string
		FirstName *string
		LastName  *string
	}

	// TODO: use mongoDB
	// initializers.DB.Raw("SELECT id, password, first_name, last_name FROM users WHERE email = ?", *data.Email).Scan(&isFound)

	if isFound.ID == nil {
		helpers.BadRequest(fmt.Sprintf("User With This Email \"%s\" is Not Exists Try SingUp", *data.Email), w)
		return
	}

	err = helpers.ComparePassword(*isFound.Password, *data.Password)

	if err != nil {
		helpers.BadRequest("Password Or Email Is Wrong Try Again", w)
		return
	}

	user := &User{
		ID:        *isFound.ID,
		Email:     *data.Email,
		FirstName: *isFound.FirstName,
		LastName:  *isFound.LastName,
	}

	helpers.SetCookie(user.ID, w)
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
