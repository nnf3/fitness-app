package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UID string `gorm:"unique;not null"`
}

// BeforeSave GORMフック - 保存前のバリデーション
func (u *User) BeforeSave(tx *gorm.DB) error {
	return u.Validate()
}

// BeforeCreate GORMフック - 作成前の処理
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if err := tx.Where("uid = ?", u.UID).First(&User{}).Error; err == nil {
		return fmt.Errorf("UIDはすでに存在します")
	}
	return u.Validate()
}

// BeforeUpdate GORMフック - 更新前の処理
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	return u.Validate()
}

// Validate カスタムバリデーション
func (u *User) Validate() error {
	if u.UID == "" {
		return fmt.Errorf("UIDは必須です")
	}
	return nil
}
