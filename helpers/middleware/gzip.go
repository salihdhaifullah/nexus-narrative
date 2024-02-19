package middleware

import (
	"compress/gzip"
	"io"
	"net/http"
	"strings"
)

func Gzip(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
            w.Header().Set("Content-Encoding", "gzip")
            gz := gzip.NewWriter(w)
            defer gz.Close()
            gzr := gzipResponseWriter{Writer: gz, ResponseWriter: w}
            next.ServeHTTP(gzr, r)
        } else {
            next.ServeHTTP(w, r)
        }
    })
}

type gzipResponseWriter struct {
    io.Writer
    http.ResponseWriter
}

func (w gzipResponseWriter) Write(b []byte) (int, error) {
    return w.Writer.Write(b)
}
