package entity

import (
	"fmt"
)

type SetLog struct {
	gorm.Model
	WorkoutLogID   uint `gorm:"not null;index"`
	WorkoutTypeID uint `gorm:"not null;index"`
	Weight         int  `gorm:"not null"`  // 何キロでやったか
	RepCount       int  `gorm:"not null"`  // 何レップやったか
	SerNumber      int  `gorm:"not null"`  // 何セット目か

	WorkoutLog   WorkoutLog   `gorm:"constraint:OnDelete:CASCADE;foreignKey:WorkoutLogID"`
	WorkoutType  WorkoutType  `gorm:"constraint:OnDelete:CASCADE;foreignKey:WorkoutTypeID"`
}

func (s *SetLog) Validate() error {
	if s.WorkoutLogID == 0 {
		return fmt.Errorf("workout_log_id は必須です")
	}
	if s.WorkoutTypeID == 0 {
		return fmt.Errorf("workout_type_type_id は必須です")
	}
	if s.Weight <= 0 {
		return fmt.Errorf("重量は正の整数で入力してください")
	}
	if s.RepCount <= 0 {
		return fmt.Errorf("レップ数は正の整数で入力してください")
	}
	if s.SerNumber <= 0 {
		return fmt.Errorf("セット番号は正の整数で入力してください")
	}
	return nil
}

func (s *SetLog) BeforeSave(tx *gorm.DB) error   { return s.Validate() }
func (s *SetLog) BeforeCreate(tx *gorm.DB) error { return s.Validate() }
func (s *SetLog) BeforeUpdate(tx *gorm.DB) error { return s.Validate() }