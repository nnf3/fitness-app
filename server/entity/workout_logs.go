package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type WorkoutLog struct {
	gorm.Model
	UserID    uint           `gorm:"not null;index"`

	User     User      `gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID"`
	SetLogs  []SetLog  `gorm:"foreignKey:WorkoutLogID;constraint:OnDelete:CASCADE"`
}

func (wl *WorkoutLog) Validate() error {
	if wl.UserID == 0 {
		return fmt.Errorf("ユーザーIDは必須です")
	}
	return nil
}