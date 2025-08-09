package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type SetLog struct {
	gorm.Model
	WorkoutExerciseID uint `gorm:"not null;index"`
	Weight            int  `gorm:"not null"` // 何キロでやったか
	RepCount          int  `gorm:"not null"` // 何レップやったか
	SetNumber         int  `gorm:"not null"` // 何セット目か

	WorkoutExercise WorkoutExercise `gorm:"constraint:OnDelete:CASCADE;foreignKey:WorkoutExerciseID"`
}

func (s *SetLog) BeforeSave(tx *gorm.DB) error {
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
	if s.WorkoutExerciseID == 0 {
		return fmt.Errorf("workout_exercise_id は必須です")
	}
	if s.Weight <= 0 {
		return fmt.Errorf("重量は正の整数で入力してください")
	}
	if s.RepCount <= 0 {
		return fmt.Errorf("レップ数は正の整数で入力してください")
	}
	if s.SetNumber <= 0 {
		return fmt.Errorf("セット番号は正の整数で入力してください")
	}
	return nil
}

// checkForeignKeys は WorkoutLog, WorkoutType の存在チェックを行う
func (s *SetLog) checkForeignKeys(tx *gorm.DB) error {
	var count int64

	// WorkoutExercise存在確認
	tx.Model(&WorkoutExercise{}).Where("id = ?", s.WorkoutExerciseID).Count(&count)
	if count == 0 {
		return fmt.Errorf("指定された workout_exercise_id は存在しません")
	}

	return nil
}
