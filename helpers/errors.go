package helpers

import (
	"encoding/json"
	"net/http"
)

type Response struct {
	IsOk    bool        `json:"isOK"`
	Message string      `json:"errors"`
	Data    interface{} `json:"data"`
}

func BadRequest(w http.ResponseWriter, message string) {
	res := Response{
		Message: message,
		IsOk:    false,
	}

	w.WriteHeader(http.StatusBadRequest)
	w.Header().Set("Content-Type", "application/json")
	bytes, _ := json.Marshal(res)
	w.Write(bytes)
}

func NotFound(w http.ResponseWriter, message string) {
	res := Response{
		Message: message,
		IsOk:    false,
	}

	w.WriteHeader(http.StatusNotFound)
	w.Header().Set("Content-Type", "application/json")
	bytes, _ := json.Marshal(res)
	w.Write(bytes)
}
