package workout_type

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type WorkoutTypeRepository interface {
	GetWorkoutTypes(ctx context.Context) ([]entity.WorkoutType, error)
	GetWorkoutTypeByID(ctx context.Context, id string) (*entity.WorkoutType, error)
}

type workoutTypeRepository struct {
	db *gorm.DB
}

func NewWorkoutTypeRepository(db *gorm.DB) WorkoutTypeRepository {
	return &workoutTypeRepository{db: db}
}

func (r *workoutTypeRepository) GetWorkoutTypes(ctx context.Context) ([]entity.WorkoutType, error) {
	var workoutTypes []entity.WorkoutType
	if err := r.db.Find(&workoutTypes).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout types: %w", err)
	}
	return workoutTypes, nil
}

func (r *workoutTypeRepository) GetWorkoutTypeByID(ctx context.Context, id string) (*entity.WorkoutType, error) {
	workoutTypeID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout type ID: %s", id)
	}

	var workoutType entity.WorkoutType
	if err := r.db.Where("id = ?", uint(workoutTypeID)).First(&workoutType).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout type: %w", err)
	}

	return &workoutType, nil
}
