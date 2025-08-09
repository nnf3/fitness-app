package workout

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type WorkoutRepository interface {
	GetWorkoutByID(ctx context.Context, id string) (*entity.Workout, error)
	GetWorkoutsByUserID(ctx context.Context, userID string) ([]*entity.Workout, error)
	CreateWorkout(ctx context.Context, workout *entity.Workout) error
	// Batch methods for DataLoader
	GetWorkoutsByIDs(workoutIDs []uint) ([]*entity.Workout, error)
	GetWorkoutsByUserIDs(userIDs []uint) ([]*entity.Workout, error)
}

type workoutRepository struct {
	db *gorm.DB
}

func NewWorkoutRepository(db *gorm.DB) WorkoutRepository {
	return &workoutRepository{db: db}
}

func (r *workoutRepository) GetWorkoutByID(ctx context.Context, id string) (*entity.Workout, error) {
	workoutID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout ID: %s", id)
	}

	var workout entity.Workout
	if err := r.db.Where("id = ?", uint(workoutID)).First(&workout).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout: %w", err)
	}
	return &workout, nil
}

func (r *workoutRepository) GetWorkoutsByUserID(ctx context.Context, userID string) ([]*entity.Workout, error) {
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %s", userID)
	}

	var workouts []entity.Workout
	if err := r.db.Where("user_id = ?", uint(id)).Find(&workouts).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workouts: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Workout, len(workouts))
	for i := range workouts {
		result[i] = &workouts[i]
	}

	return result, nil
}

func (r *workoutRepository) CreateWorkout(ctx context.Context, workout *entity.Workout) error {
	return r.db.Create(workout).Error
}

// Batch methods for DataLoader
func (r *workoutRepository) GetWorkoutsByIDs(workoutIDs []uint) ([]*entity.Workout, error) {
	if len(workoutIDs) == 0 {
		return []*entity.Workout{}, nil
	}

	var workouts []entity.Workout
	if err := r.db.Where("id IN ?", workoutIDs).Find(&workouts).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workouts by IDs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Workout, len(workouts))
	for i := range workouts {
		result[i] = &workouts[i]
	}

	return result, nil
}

func (r *workoutRepository) GetWorkoutsByUserIDs(userIDs []uint) ([]*entity.Workout, error) {
	if len(userIDs) == 0 {
		return []*entity.Workout{}, nil
	}

	var workouts []entity.Workout
	if err := r.db.Where("user_id IN ?", userIDs).Find(&workouts).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workouts by user IDs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Workout, len(workouts))
	for i := range workouts {
		result[i] = &workouts[i]
	}

	return result, nil
}
