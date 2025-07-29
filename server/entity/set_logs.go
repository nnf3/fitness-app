package entity

import (
	"fmt"

	"gorm.io/gorm"
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

func (s *SetLog) BeforeSave(tx *gorm.DB) error   { 
	return s.Validate() 
}

func (s *SetLog) BeforeCreate(tx *gorm.DB) error {
	// 追加で外部キーの存在チェック
	if err := s.Validate(); err != nil {
		return err
	}
	return s.checkForeignKeys(tx)
}

func (s *SetLog) BeforeUpdate(tx *gorm.DB) error { 
	return s.Validate() 
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

// checkForeignKeys は WorkoutLog, WorkoutType の存在チェックを行う
func (s *SetLog) checkForeignKeys(tx *gorm.DB) error {
	var count int64

	// WorkoutLog存在確認
	tx.Model(&WorkoutLog{}).Where("id = ?", s.WorkoutLogID).Count(&count)
	if count == 0 {
		return fmt.Errorf("指定された workout_log_id は存在しません")
	}

	// WorkoutType存在確認
	tx.Model(&WorkoutType{}).Where("id = ?", s.WorkoutTypeID).Count(&count)
	if count == 0 {
		return fmt.Errorf("指定された workout_type_id は存在しません")
	}

	return nil
}