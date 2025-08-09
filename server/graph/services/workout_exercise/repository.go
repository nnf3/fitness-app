package workout_exercise

import (
	"app/entity"
	"context"
	"fmt"

	"gorm.io/gorm"
)

type WorkoutExerciseRepository interface {
	CreateWorkoutExercise(ctx context.Context, workoutExercise *entity.WorkoutExercise) error

	// バッチ取得メソッド（DataLoader用）
	GetWorkoutExercisesByWorkoutIDs(workoutIDs []uint) ([]*entity.WorkoutExercise, error)
	GetWorkoutExercisesByExerciseIDs(exerciseIDs []uint) ([]*entity.WorkoutExercise, error)
}

type workoutExerciseRepository struct {
	db *gorm.DB
}

func NewWorkoutExerciseRepository(db *gorm.DB) WorkoutExerciseRepository {
	return &workoutExerciseRepository{db: db}
}

func (r *workoutExerciseRepository) CreateWorkoutExercise(ctx context.Context, workoutExercise *entity.WorkoutExercise) error {
	if err := r.db.Create(workoutExercise).Error; err != nil {
		return fmt.Errorf("failed to create workout exercise: %w", err)
	}
	return nil
}

// GetWorkoutExercisesByWorkoutIDs はバッチでWorkoutID別にWorkoutExerciseを取得
func (r *workoutExerciseRepository) GetWorkoutExercisesByWorkoutIDs(workoutIDs []uint) ([]*entity.WorkoutExercise, error) {
	if len(workoutIDs) == 0 {
		return []*entity.WorkoutExercise{}, nil
	}

	var workoutExercises []entity.WorkoutExercise
	if err := r.db.Where("workout_id IN ?", workoutIDs).Find(&workoutExercises).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout exercises by workout IDs: %w", err)
	}

	// ポインタスライスに変換
	result := make([]*entity.WorkoutExercise, len(workoutExercises))
	for i := range workoutExercises {
		result[i] = &workoutExercises[i]
	}
	return result, nil
}

// GetWorkoutExercisesByExerciseIDs はバッチでExerciseID別にWorkoutExerciseを取得
func (r *workoutExerciseRepository) GetWorkoutExercisesByExerciseIDs(exerciseIDs []uint) ([]*entity.WorkoutExercise, error) {
	if len(exerciseIDs) == 0 {
		return []*entity.WorkoutExercise{}, nil
	}

	var workoutExercises []entity.WorkoutExercise
	if err := r.db.Where("exercise_id IN ?", exerciseIDs).Find(&workoutExercises).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout exercises by exercise IDs: %w", err)
	}

	// ポインタスライスに変換
	result := make([]*entity.WorkoutExercise, len(workoutExercises))
	for i := range workoutExercises {
		result[i] = &workoutExercises[i]
	}
	return result, nil
}
