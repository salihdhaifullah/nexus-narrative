package db

import (
	"testing"

	"github.com/go-playground/validator/v10"
)

func TestIsValidURLPath(t *testing.T) {
	validPaths := []string{
		"hello-world",
		"123-abc",
	}

	invalidPaths := []string{
		"path with space",
		"special#chars",
		"/withslash",
		"invalid?",
	}

	for _, path := range validPaths {
		if !IsValidURLPath(path) {
			t.Errorf("Expected path %s to be valid, but it was invalid", path)
		}
	}

	for _, path := range invalidPaths {
		if IsValidURLPath(path) {
			t.Errorf("Expected path %s to be invalid, but it was valid", path)
		}
	}
}

type TestUrl struct {
	Url string `validate:"required,hostname_rfc1123"`
}

var v = validator.New(validator.WithRequiredStructEnabled())

func IsValidURLPath(url string) bool {
	test := TestUrl{Url: url}
	if err := v.Struct(test); err != nil {
		return false
	}
	return true
}

type TestHttpUrls struct {
	Images []string `validate:"dive,required,http_url"`
}

func IsValidURLList(images []string) bool {
	val := TestHttpUrls{Images: images}
	if err := v.Struct(val); err != nil {
		return false
	}
	return true
}

func TestIsValidURLList(t *testing.T) {
	validURLs := []string{
		"http://example.com",
		"https://example.com",
		"http://sub.example.com/path",
	}

	invalidURLs := []string{
		"ftp://example.com",
		"invalid-url",
		"htp://example.com",
		"http:/example.com",
	}

	if !IsValidURLList(validURLs) {
		t.Errorf("Expected list of URLs %s to be valid, but it was invalid", validURLs)
	}

	if IsValidURLList(invalidURLs) {
		t.Errorf("Expected list of URLs %s to be invalid, but it was valid", invalidURLs)
	}


    validURLs = []string{
		"http://example.com",
		"https://example.com/helloosa.jpg",
		"http://sub.example.com/path.html",
	}

	invalidURLs = []string{
		"",
		"http://example.com",
		"https://example.com/helloosa.jpg",
		"http://sub.example.com/path.html",
	}

	if !IsValidURLList(validURLs) {
		t.Errorf("Expected list of URLs %s to be valid, but it was invalid", validURLs)
	}

	if IsValidURLList(invalidURLs) {
		t.Errorf("Expected list of URLs %s to be invalid, but it was valid", invalidURLs)
	}

    validURLs = []string{}

	if !IsValidURLList(validURLs) {
		t.Errorf("Expected list of URLs %s to be valid, but it was invalid", validURLs)
	}
}
