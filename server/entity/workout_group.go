package entity

import (
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

type WorkoutGroup struct {
	gorm.Model
	Title    string `gorm:"size:255;not null"`
	Date     *time.Time
	ImageURL *string

	Workouts []Workout `gorm:"foreignKey:WorkoutGroupID;constraint:OnDelete:SET NULL"`
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
	if g.ImageURL != nil && *g.ImageURL != "" {
		if !strings.HasPrefix(*g.ImageURL, "https://") {
			return fmt.Errorf("画像URLはhttpsから始まる必要があります")
		}
	}
	return nil
}
