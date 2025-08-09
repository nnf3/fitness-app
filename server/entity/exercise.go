package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type Exercise struct {
	gorm.Model
	Name        string `gorm:"size:255;not null;unique"`
	Description string `gorm:"size:1000"`
	Category    string `gorm:"size:100"`
}

func (e *Exercise) BeforeSave(tx *gorm.DB) error {
	return e.Validate()
}

func (e *Exercise) BeforeCreate(tx *gorm.DB) error {
	var count int64
	tx.Model(&Exercise{}).Where("name = ?", e.Name).Count(&count)
	if count > 0 {
		return fmt.Errorf("種目名 '%s' はすでに存在します", e.Name)
	}
	return e.Validate()
}

func (e *Exercise) BeforeUpdate(tx *gorm.DB) error {
	return e.Validate()
}

func (e *Exercise) Validate() error {
	if e.Name == "" {
		return fmt.Errorf("種目名は必須です")
	}
	if len(e.Name) > 255 {
		return fmt.Errorf("種目名は255文字以内で入力してください")
	}
	if len(e.Description) > 1000 {
		return fmt.Errorf("説明は1000文字以内で入力してください")
	}
	if len(e.Category) > 100 {
		return fmt.Errorf("カテゴリは100文字以内で入力してください")
	}
	return nil
}
