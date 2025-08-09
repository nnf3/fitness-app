package exercise

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type ExerciseRepository interface {
	GetExercises(ctx context.Context) ([]entity.Exercise, error)
	GetExerciseByID(ctx context.Context, id string) (*entity.Exercise, error)
}

type exerciseRepository struct {
	db *gorm.DB
}

func NewExerciseRepository(db *gorm.DB) ExerciseRepository {
	return &exerciseRepository{db: db}
}

func (r *exerciseRepository) GetExercises(ctx context.Context) ([]entity.Exercise, error) {
	var exercises []entity.Exercise
	if err := r.db.Find(&exercises).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch exercises: %w", err)
	}
	return exercises, nil
}

func (r *exerciseRepository) GetExerciseByID(ctx context.Context, id string) (*entity.Exercise, error) {
	exerciseID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid exercise ID: %s", id)
	}

	var exercise entity.Exercise
	if err := r.db.Where("id = ?", uint(exerciseID)).First(&exercise).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch exercise: %w", err)
	}

	return &exercise, nil
}
