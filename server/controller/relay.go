package controller

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"fgo-addon/upstream"
)

// ProxyToKejifuwu 通用转发：我们的 /api/fgo/*  →  上游 KEJIFUWU_API_PREFIX/*
// 例：POST /api/fgo/task/start → POST {KEJIFUWU_BASE_URL}/api/task/start
// 用户只需带我们的 JWT（网页）或 sk- 令牌，上游会话由服务端统一注入。
func ProxyToKejifuwu(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "msg": "请求体读取失败"})
		return
	}

	upstreamPath := upstream.APIPrefix + c.Param("path") // c.Param("path") 自带前导 /

	status, contentType, data, err := upstream.Default.Do(c.Request.Method, upstreamPath, body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "msg": "上游请求失败: " + err.Error()})
		return
	}
	if contentType == "" {
		contentType = "application/json; charset=utf-8"
	}
	c.Data(status, contentType, data)
}
