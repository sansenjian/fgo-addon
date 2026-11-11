package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"fgo-addon/controller"
	"fgo-addon/middleware"
)

func Setup() *gin.Engine {
	r := gin.Default()
	r.Use(cors.AllowAll())

	api := r.Group("/api")
	{
		api.POST("/user/register", controller.Register)
		api.POST("/user/login", controller.Login)
		api.GET("/user/self", middleware.Auth(), controller.Self)

		// 令牌管理（new-api 风格 sk- 密钥）
		api.GET("/token", middleware.Auth(), controller.ListTokens)
		api.POST("/token", middleware.Auth(), controller.CreateToken)
		api.DELETE("/token/:id", middleware.Auth(), controller.DeleteToken)

		// 通用转发：/api/fgo[/...] → 上游 GraphQL，注入我们持有的账号会话
		api.POST("/fgo", middleware.Auth(), controller.ProxyToKejifuwu)
		api.Any("/fgo/*path", middleware.Auth(), controller.ProxyToKejifuwu)
	}
	return r
}
