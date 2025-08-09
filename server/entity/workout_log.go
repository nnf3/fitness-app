package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type WorkoutLog struct {
	gorm.Model
	UserID    uint           `gorm:"not null;index"`
	WorkoutGroupID *uint          `gorm:"index"` // 追加: nullableな外部キー
	WorkoutGroup   *WorkoutGroup  // 追加: リレーション

	User     User      `gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID"`
	SetLogs  []SetLog  `gorm:"foreignKey:WorkoutLogID;constraint:OnDelete:CASCADE"`
}

func (w *WorkoutLog) BeforeSave(tx *gorm.DB) error {
	return w.Validate()
}

func (w *WorkoutLog) BeforeCreate(tx *gorm.DB) error {
	// User の存在をチェック（DB整合性のため）
	var user User
	if err := tx.First(&user, w.UserID).Error; err != nil {
		return fmt.Errorf("対象のユーザーが存在しません（UserID: %d）", w.UserID)
	}
	return nil
}

func (w *WorkoutLog) BeforeUpdate(tx *gorm.DB) error {
	return w.Validate()
}

func (wl *WorkoutLog) Validate() error {
	if wl.UserID == 0 {
		return fmt.Errorf("ユーザーIDは必須です")
	}
	return nil
}