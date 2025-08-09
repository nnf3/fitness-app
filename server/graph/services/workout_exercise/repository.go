package workout_exercise

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type WorkoutExerciseRepository interface {
	GetWorkoutExercisesByWorkoutID(ctx context.Context, workoutID string) ([]entity.WorkoutExercise, error)
	CreateWorkoutExercise(ctx context.Context, workoutExercise *entity.WorkoutExercise) error
}

type workoutExerciseRepository struct {
	db *gorm.DB
}

func NewWorkoutExerciseRepository(db *gorm.DB) WorkoutExerciseRepository {
	return &workoutExerciseRepository{db: db}
}

func (r *workoutExerciseRepository) GetWorkoutExercisesByWorkoutID(ctx context.Context, workoutID string) ([]entity.WorkoutExercise, error) {
	workoutIDUint, err := strconv.ParseUint(workoutID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout ID: %s", workoutID)
	}

	var workoutExercises []entity.WorkoutExercise
	if err := r.db.Where("workout_id = ?", uint(workoutIDUint)).Find(&workoutExercises).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout exercises: %w", err)
	}
	return workoutExercises, nil
}

func (r *workoutExerciseRepository) CreateWorkoutExercise(ctx context.Context, workoutExercise *entity.WorkoutExercise) error {
	if err := r.db.Create(workoutExercise).Error; err != nil {
		return fmt.Errorf("failed to create workout exercise: %w", err)
	}
	return nil
}
