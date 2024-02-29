package dto

import (
	"log"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

// TODO: use singleton for the validation service
func init() {

}

func ValidationDTO(model interface{}) []string {
	validate := validator.New(validator.WithRequiredStructEnabled())
	en := en.New()
	uni := ut.New(en, en)
	trans, _ := uni.GetTranslator("en")
	en_translations.RegisterDefaultTranslations(validate, trans)

	validate.RegisterTranslation("required", trans, func(ut ut.Translator) error {
		return ut.Add("required", "{0} must have a value!", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("required", fe.Field())
		return t
	})

	if err := validate.Struct(model); err != nil {
		var validationErrors []string

		for _, e := range err.(validator.ValidationErrors) {
			err := e.Translate(trans)
			log.Println(err)
			validationErrors = append(validationErrors, err)
		}

		return validationErrors
	}

	return nil
}
