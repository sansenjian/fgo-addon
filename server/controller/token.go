package controller

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"fgo-addon/model"
)

// GET /api/token — 列出当前用户的所有令牌（new-api: GET /api/token）
func ListTokens(c *gin.Context) {
	var tokens []model.Token
	model.DB.Where("user_id = ?", c.GetInt("user_id")).Order("id desc").Find(&tokens)
	c.JSON(http.StatusOK, gin.H{"success": true, "msg": "", "data": tokens})
}

type CreateTokenRequest struct {
	Name           string `json:"name" binding:"required,max=64"`
	ExpiredTime    int64  `json:"expired_time"`    // 秒级时间戳；0 或不传 = 永不过期
	RemainQuota    int    `json:"remain_quota"`    // 初始额度
	UnlimitedQuota bool   `json:"unlimited_quota"`
}

// POST /api/token — 创建令牌，返回 sk-xxx（new-api: POST /api/token）
func CreateToken(c *gin.Context) {
	var req CreateTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "msg": "参数错误: " + err.Error()})
		return
	}

	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "令牌生成失败"})
		return
	}
	expired := req.ExpiredTime
	if expired == 0 {
		expired = -1
	}
	now := time.Now().Unix()
	token := model.Token{
		UserId:         c.GetInt("user_id"),
		Key:            "sk-" + hex.EncodeToString(buf),
		Name:           req.Name,
		Status:         1,
		CreatedTime:    now,
		AccessedTime:   now,
		ExpiredTime:    expired,
		RemainQuota:    req.RemainQuota,
		UnlimitedQuota: req.UnlimitedQuota,
	}
	if err := model.DB.Create(&token).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "创建失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "msg": "", "data": token})
}

// DELETE /api/token/:id — 删除自己的令牌
func DeleteToken(c *gin.Context) {
	var token model.Token
	if err := model.DB.Where("id = ? AND user_id = ?", c.Param("id"), c.GetInt("user_id")).First(&token).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "msg": "令牌不存在"})
		return
	}
	if err := model.DB.Delete(&token).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "删除失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "msg": ""})
}
