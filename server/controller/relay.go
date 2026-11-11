package controller

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"fgo-addon/upstream"
)

// ProxyToKejifuwu GraphQL 透传：
// 我们站点的 /api/fgo/* 收到 {"query","variables"} 后原样转发给上游 graphql.fatego.cn，
// 自动注入我们持有的上游账号 JWT；上游业务差异全部封装在 GraphQL query 里，本层零适配。
func ProxyToKejifuwu(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "msg": "请求体读取失败"})
		return
	}
	status, data, err := upstream.Default.Do(body)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "msg": "上游请求失败: " + err.Error()})
		return
	}
	c.Data(status, "application/json; charset=utf-8", data)
}
