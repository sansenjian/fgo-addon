package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"fgo-addon/config"
	"fgo-addon/model"
)

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=2,max=64"`
	Nickname string `json:"nickname" binding:"omitempty,max=64"`
	Password string `json:"password" binding:"required,min=6,max=72"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "msg": "参数错误: " + err.Error()})
		return
	}

	var count int64
	model.DB.Model(&model.User{}).Where("username = ?", req.Username).Count(&count)
	if count > 0 {
		c.JSON(http.StatusOK, gin.H{"success": false, "msg": "用户名已被注册"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "服务器内部错误"})
		return
	}

	now := time.Now().Unix()
	user := model.User{
		Username:    req.Username,
		Password:    string(hashed),
		DisplayName: req.Nickname,
		Role:        1,
		Status:      1,
		CreatedTime: now,
		UpdatedTime: now,
	}
	if err := model.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "注册失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "msg": ""})
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func generateToken(userId int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
	}
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(config.JWTSecret))
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "msg": "参数错误"})
		return
	}

	var user model.User
	if err := model.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "msg": "用户名或密码错误"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)) != nil {
		c.JSON(http.StatusOK, gin.H{"success": false, "msg": "用户名或密码错误"})
		return
	}

	token, err := generateToken(user.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "msg": "令牌生成失败"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"msg":     "",
		"data": gin.H{
			"token": token,
			"user":  user.Safe(),
		},
	})
}

func Self(c *gin.Context) {
	var user model.User
	if err := model.DB.First(&user, c.GetInt("user_id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "msg": "用户不存在"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "msg": "", "data": user.Safe()})
}
