package model

// User 字段风格对齐 new-api 的 users 表（时间戳用 int64，密码 bcrypt，角色分级）
type User struct {
	Id          int    `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	Username    string `json:"username" gorm:"type:varchar(64);uniqueIndex;not null"`
	Password    string `json:"-" gorm:"type:varchar(128);not null"`
	DisplayName string `json:"display_name" gorm:"type:varchar(64);default:''"`
	Role        int    `json:"role" gorm:"type:int;default:1"`   // 1=普通用户 10=管理员 100=超级管理员
	Status      int    `json:"status" gorm:"type:int;default:1"` // 1=启用 2=禁用
	CreatedTime int64  `json:"created_time" gorm:"bigint"`
	UpdatedTime int64  `json:"updated_time" gorm:"bigint"`
}

func (User) TableName() string {
	return "users"
}

type UserSafe struct {
	Id          int    `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
	Role        int    `json:"role"`
	CreatedTime int64  `json:"created_time"`
}

func (u *User) Safe() UserSafe {
	return UserSafe{
		Id:          u.Id,
		Username:    u.Username,
		DisplayName: u.DisplayName,
		Role:        u.Role,
		CreatedTime: u.CreatedTime,
	}
}
