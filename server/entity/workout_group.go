package entity

import (
    "fmt"

    "gorm.io/gorm"
)

type WorkoutGroup struct {
		gorm.Model
    ID        uint           `gorm:"primaryKey"`
    Title     string         `gorm:"size:255;not null"`

    WorkoutLogs []WorkoutLog `gorm:"foreignKey:WorkoutGroupID;constraint:OnDelete:SET NULL"`
}

func (g *WorkoutGroup) BeforeSave(tx *gorm.DB) error {
    return g.Validate()
}

func (g *WorkoutGroup) BeforeCreate(tx *gorm.DB) error {
    // タイトルの重複チェック
    var count int64
    tx.Model(&WorkoutGroup{}).Where("title = ?", g.Title).Count(&count)
    if count > 0 {
        return fmt.Errorf("グループ名 '%s' はすでに存在します", g.Title)
    }
    return nil
}

func (g *WorkoutGroup) BeforeUpdate(tx *gorm.DB) error {
    return g.Validate()
}

func (g *WorkoutGroup) Validate() error {
    if g.Title == "" {
        return fmt.Errorf("グループ名は必須です")
    }
    if len(g.Title) > 255 {
        return fmt.Errorf("グループ名は255文字以内で入力してください")
    }
    return nil
}