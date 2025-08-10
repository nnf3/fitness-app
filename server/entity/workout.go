package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Workout struct {
	gorm.Model
	Date           *time.Time
	UserID         uint  `gorm:"not null;index"`
	WorkoutGroupID *uint `gorm:"index"`

	User             User `gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID"`
	WorkoutGroup     *WorkoutGroup
	WorkoutExercises []WorkoutExercise `gorm:"foreignKey:WorkoutID;constraint:OnDelete:CASCADE"`
}

func (w *Workout) BeforeSave(tx *gorm.DB) error {
	return w.Validate()
}

func (w *Workout) BeforeCreate(tx *gorm.DB) error {
	// User の存在をチェック（DB整合性のため）
	var user User
	if err := tx.First(&user, w.UserID).Error; err != nil {
		return fmt.Errorf("対象のユーザーが存在しません（UserID: %d）", w.UserID)
	}
	return nil
}

func (w *Workout) BeforeUpdate(tx *gorm.DB) error {
	return w.Validate()
}

func (wl *Workout) Validate() error {
	if wl.UserID == 0 {
		return fmt.Errorf("ユーザーIDは必須です")
	}
	return nil
}
