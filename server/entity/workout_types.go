package entity

import (
	"fmt"
)

type WorkoutType struct {
	gorm.Model
	Name string `gorm:"size:255;not null"`
	
	SetLogs []SetLog `gorm:"foreignKey:WorkoutTypeID;constraint:OnDelete:CASCADE"`
}

func (wt *WorkoutType) Validate() error {
	if wt.Name == "" {
		return fmt.Errorf("種目名は必須です")
	}
	if len(wt.Name) > 255 {
		return fmt.Errorf("種目名は255文字以内で入力してください")
	}
	return nil
}