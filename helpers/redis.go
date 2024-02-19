package helpers

import (
	"context"
	"log"
	"os"
	"time"

	redis "github.com/redis/go-redis/v9"
)

type Redis struct {
    redisRef *redis.Client
    ctx context.Context
}

var redisClient *Redis

func NewRedis() Redis {
    if redisClient != nil {
        return *redisClient
    }

    url := os.Getenv("REDIS_URL")
    if url == "" {
        log.Fatal("redis connection string is not found")
    }

    options, err := redis.ParseURL(url)
    if err != nil {
        log.Fatal(err)
    }

    redisRef := redis.NewClient(options)

    return Redis{
        redisRef: redisRef,
        ctx: context.Background(),
    }
}

func (cache Redis) Get(key string) *string {
    val, err := cache.redisRef.Get(cache.ctx, key).Result()
    if err == redis.Nil {
        return nil
    }
    if err != nil {
        log.Fatal(err)
    }
    return &val
}

func (cache Redis) Set(value string, key string, exp time.Duration)  {
    err := cache.redisRef.Set(cache.ctx, key, value, exp).Err()
    if err != nil {
        log.Fatal(err)
    }
}
