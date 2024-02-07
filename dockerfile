FROM node:18-alpine AS tailwind-css-builder

WORKDIR /app

COPY . .

RUN yarn && npx tailwindcss -i ./tailwind.css -o ./index.css --minify

FROM golang:latest AS app-builder

WORKDIR /app

COPY . .

RUN go mod tidy
RUN go build -o main .

FROM golang:latest

WORKDIR /app

COPY --from=app-builder /app/main /app/main
COPY --from=app-builder /app/views /app/views
COPY --from=app-builder /app/static /app/static
COPY --from=app-builder /app/.env /app/.env
COPY --from=tailwind-css-builder /app/index.css /app/static/index.css

CMD ["./main"]
