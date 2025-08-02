package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type WorkoutType struct {
	gorm.Model
	Name        string `gorm:"size:255;not null;unique"`
	Description string `gorm:"size:1000"`
	Category    string `gorm:"size:100"`

	SetLogs []SetLog `gorm:"foreignKey:WorkoutTypeID;constraint:OnDelete:CASCADE"`
}

func (w *WorkoutType) BeforeSave(tx *gorm.DB) error {
	return w.Validate()
}

func (w *WorkoutType) BeforeCreate(tx *gorm.DB) error {
	// 名前が重複していないかチェック
	var count int64
	tx.Model(&WorkoutType{}).Where("name = ?", w.Name).Count(&count)
	if count > 0 {
		return fmt.Errorf("種目名 '%s' はすでに存在します", w.Name)
	}
	return nil
}

func (w *WorkoutType) BeforeUpdate(tx *gorm.DB) error {
	return w.Validate()
}

func (wt *WorkoutType) Validate() error {
	if wt.Name == "" {
		return fmt.Errorf("種目名は必須です")
	}
	if len(wt.Name) > 255 {
		return fmt.Errorf("種目名は255文字以内で入力してください")
	}
	if len(wt.Description) > 1000 {
		return fmt.Errorf("説明は1000文字以内で入力してください")
	}
	if len(wt.Category) > 100 {
		return fmt.Errorf("カテゴリは100文字以内で入力してください")
	}
	return nil
}
