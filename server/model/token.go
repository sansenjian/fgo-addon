package model

// Token 结构对齐 new-api 的 tokens 表：sk- 前缀密钥 + 额度字段
type Token struct {
	Id             int    `json:"id" gorm:"column:id;primaryKey;autoIncrement"`
	UserId         int    `json:"user_id" gorm:"column:user_id;index"`
	Key            string `json:"key" gorm:"column:key;type:varchar(64);uniqueIndex"`
	Name           string `json:"name" gorm:"column:name;type:varchar(64)"`
	Status         int    `json:"status" gorm:"column:status;type:int;default:1"` // 1=启用 2=禁用
	CreatedTime    int64  `json:"created_time" gorm:"column:created_time;bigint"`
	AccessedTime   int64  `json:"accessed_time" gorm:"column:accessed_time;bigint"`
	ExpiredTime    int64  `json:"expired_time" gorm:"column:expired_time;bigint"` // -1=永不过期
	RemainQuota    int    `json:"remain_quota" gorm:"column:remain_quota;type:int;default:0"`
	UsedQuota      int    `json:"used_quota" gorm:"column:used_quota;type:int;default:0"`
	UnlimitedQuota bool   `json:"unlimited_quota" gorm:"column:unlimited_quota;default:false"`
}

func (Token) TableName() string {
	return "tokens"
}
