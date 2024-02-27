package dto

type SingUp struct {
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
	FirstName string `json:"firstName" validate:"required,min=2,max=75"`
	LastName  string `json:"lastName" validate:"required,min=2,max=75"`
}

type Login struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type AccountVerification struct {
	Code string `json:"code" validate:"required,len=6,number"`
}

type ResetPassword struct {
	Code     string `json:"code" validate:"required,len=6,number"`
	Password string `json:"password" validate:"required,min=8"`
}

type ForgatPassword struct {
	Email string `json:"email" validate:"required,email"`
}
