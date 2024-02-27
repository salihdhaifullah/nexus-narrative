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

func TestIsVaildCode(t *testing.T) {
	validCodes := []string{
		"286142",
		"272175",
		"998862",
		"080002",
		"072100",
		"000862",
	}

	unValidCodes := []string{
		"2.8142",
		"2.78142",
		"$8862",
		"$08862",
		"f87932",
		"f879327",

		"2.8142c",
		"2.7814u",
		"1886i",
		"90978862",
		"9097881",
		"uasigg",
		"aaaaaaa",
		"aaaaaa",
	}

	for _, code := range validCodes {
		if !IsVaildCode(code) {
			t.Errorf("Expected code %s to be valid, but it was invalid", code)
		}
	}

	for _, code := range unValidCodes {
		if IsVaildCode(code) {
			t.Errorf("Expected code %s to be invalid, but it was valid", code)
		}
	}
}

type COdeSchame struct {
	Code   string `json:"code" validate:"required,number,len=6"`
}

func IsVaildCode(code string) bool {
	val := COdeSchame{
		Code: code,
	}

	if err := v.Struct(val); err != nil {
		return false
	}
	return true
}
