package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UID       string    `gorm:"not null;uniqueIndex" json:"uid"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

// BeforeSave GORMフック - 保存前のバリデーション
func (u *User) BeforeSave(tx *gorm.DB) error {
	return u.Validate()
}

// BeforeCreate GORMフック - 作成前の処理
func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return u.Validate()
}

// BeforeUpdate GORMフック - 更新前の処理
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return u.Validate()
}

// Validate カスタムバリデーション
func (u *User) Validate() error {
	if u.UID == "" {
		return fmt.Errorf("UIDは必須です")
	}
	return nil
}
