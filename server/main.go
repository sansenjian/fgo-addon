package main

import (
	"log"

	"fgo-addon/config"
	"fgo-addon/model"
	"fgo-addon/router"
	"fgo-addon/upstream"
)

func main() {
	config.Load()
	if err := model.InitDB(); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}
	// 启动即预热上游登录：缓存 JWT，首个用户请求免登录延迟；
	// 运行期 401 时适配层自动重登，全程无需人工干预。
	if err := upstream.WarmUp(); err != nil {
		log.Printf("[upstream] 预热登录失败（将在首个请求时重试）: %v", err)
	} else {
		log.Printf("[upstream] 上游登录预热成功")
	}
	r := router.Setup()
	log.Printf("server listening on :%s", config.Port)
	if err := r.Run(":" + config.Port); err != nil {
		log.Fatal(err)
	}
}
