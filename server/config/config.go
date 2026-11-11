package config

import (
	"os"

	"github.com/joho/godotenv"
)

// 与 new-api 同款环境变量风格：.env 或系统环境变量
var (
	DBType    = "sqlite" // sqlite | mysql
	DBDSN     = "fgo.db" // mysql 示例: user:pass@tcp(127.0.0.1:3306)/fgo?charset=utf8mb4&parseTime=True&loc=Local
	JWTSecret = "change-me-in-production"
	Port      = "3000"
)

func Load() {
	_ = godotenv.Load()
	if v := os.Getenv("DB_TYPE"); v != "" {
		DBType = v
	}
	if v := os.Getenv("DB_DSN"); v != "" {
		DBDSN = v
	}
	if v := os.Getenv("JWT_SECRET"); v != "" {
		JWTSecret = v
	}
	if v := os.Getenv("PORT"); v != "" {
		Port = v
	}
}
