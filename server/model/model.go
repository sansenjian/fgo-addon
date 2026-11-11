package model

import (
	"github.com/glebarez/sqlite"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"fgo-addon/config"
)

var DB *gorm.DB

// 与 new-api 一致：默认 SQLite 开箱即用，生产切 MySQL 只需改环境变量
func InitDB() (err error) {
	switch config.DBType {
	case "mysql":
		DB, err = gorm.Open(mysql.Open(config.DBDSN), &gorm.Config{})
	default:
		DB, err = gorm.Open(sqlite.Open(config.DBDSN), &gorm.Config{})
	}
	if err != nil {
		return err
	}
	return DB.AutoMigrate(&User{}, &Token{})
}
