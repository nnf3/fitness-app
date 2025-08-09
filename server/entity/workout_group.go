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