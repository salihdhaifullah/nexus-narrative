package helpers

import (
	"encoding/json"
	"net/http"
)

type Res struct {
	Massage string      `json:"massage"`
	Data    interface{} `json:"data"`
}

func Ok(val interface{}, massage string, w http.ResponseWriter) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	res := Res{
		Massage: massage,
		Data:    val,
	}

	write(res, w)
}

func Created(val interface{}, massage string, w http.ResponseWriter) {
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")

	res := Res{
		Massage: massage,
		Data:    val,
	}

	write(res, w)
}

// TODO: merge the errors with the status into one util
func write(val interface{}, w http.ResponseWriter) {
	encoder := json.NewEncoder(w)
	encoder.SetEscapeHTML(false)
	if err := encoder.Encode(val); err != nil {
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
}
