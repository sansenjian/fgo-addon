package main

import (
	"log"

	"fgo-addon/config"
	"fgo-addon/model"
	"fgo-addon/router"
)

func main() {
	config.Load()
	if err := model.InitDB(); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}
	r := router.Setup()
	log.Printf("server listening on :%s", config.Port)
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatal(err)
	}
}
