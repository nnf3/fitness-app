package entity

import (
	"fmt"

	"gorm.io/gorm"
)

type WorkoutExercise struct {
	gorm.Model
	WorkoutID  uint `gorm:"not null;index"`
	ExerciseID uint `gorm:"not null;index"`

	Workout  Workout  `gorm:"constraint:OnDelete:CASCADE;foreignKey:WorkoutID"`
	Exercise Exercise `gorm:"constraint:OnDelete:CASCADE;foreignKey:ExerciseID"`
	SetLogs  []SetLog `gorm:"foreignKey:WorkoutExerciseID;constraint:OnDelete:CASCADE"`
}

func (w *WorkoutExercise) BeforeSave(tx *gorm.DB) error {
	return w.Validate()
}

func (w *WorkoutExercise) BeforeCreate(tx *gorm.DB) error {
	return w.Validate()
}

func (w *WorkoutExercise) BeforeUpdate(tx *gorm.DB) error {
	return w.Validate()
}

func (w *WorkoutExercise) Validate() error {
	if w.WorkoutID == 0 {
		return fmt.Errorf("workout_id は必須です")
	}
	if w.ExerciseID == 0 {
		return fmt.Errorf("exercise_id は必須です")
	}
	return nil
}
