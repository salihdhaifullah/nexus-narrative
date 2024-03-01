package dto

import (
	"strings"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

// TODO: use singleton for the validation service
func init() {

}

func ValidationDTO(model interface{}) *string {
	validate := validator.New(validator.WithRequiredStructEnabled())
	en := en.New()
	uni := ut.New(en, en)
	trans, _ := uni.GetTranslator("en")
	en_translations.RegisterDefaultTranslations(validate, trans)

	validate.RegisterTranslation("required", trans, func(ut ut.Translator) error {
		return ut.Add("required", "{0} is required", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("required", fe.Field())
		return t
	})

	validate.RegisterTranslation("email", trans, func(ut ut.Translator) error {
		return ut.Add("email", "invalid email address", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("email", fe.Field())
		return t
	})

	validate.RegisterTranslation("min", trans, func(ut ut.Translator) error {
		return ut.Add("min", "{0} must be at least {1} characters long", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("min", fe.Field(), fe.Param())
		return t
	})

	validate.RegisterTranslation("max", trans, func(ut ut.Translator) error {
		return ut.Add("max", "{0} cannot be longer than {1} characters", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("max", fe.Field(), fe.Param())
		return t
	})

	validate.RegisterTranslation("len", trans, func(ut ut.Translator) error {
		return ut.Add("len", "{0} must be exactly {1} characters long", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("len", fe.Field(), fe.Param())
		return t
	})

	validate.RegisterTranslation("number", trans, func(ut ut.Translator) error {
		return ut.Add("number", "{0} must only contain digits from 0 to 9", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("number", fe.Field(), fe.Param())
		return t
	})

	if err := validate.Struct(model); err != nil {
		var builder strings.Builder

		errors := err.(validator.ValidationErrors)
		errorsLen := len(errors)

		for i := 0; i < errorsLen; i++ {
			err := errors[i].Translate(trans)
			builder.WriteString(err)

			if i != errorsLen-1 {
				builder.WriteString("\n")
			}
		}

		str := builder.String()
		return &str
	}

	return nil
}
