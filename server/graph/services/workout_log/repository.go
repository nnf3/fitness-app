package workout_log

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type WorkoutLogRepository interface {
	GetWorkoutLogsByUserID(ctx context.Context, userID string) ([]*entity.WorkoutLog, error)
	CreateWorkoutLog(ctx context.Context, workoutLog *entity.WorkoutLog) error
}

type workoutLogRepository struct {
	db *gorm.DB
}

func NewWorkoutLogRepository(db *gorm.DB) WorkoutLogRepository {
	return &workoutLogRepository{db: db}
}

func (r *workoutLogRepository) GetWorkoutLogsByUserID(ctx context.Context, userID string) ([]*entity.WorkoutLog, error) {
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %s", userID)
	}

	var workoutLogs []entity.WorkoutLog
	if err := r.db.Where("user_id = ?", uint(id)).Find(&workoutLogs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout logs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.WorkoutLog, len(workoutLogs))
	for i := range workoutLogs {
		result[i] = &workoutLogs[i]
	}

	return result, nil
}

func (r *workoutLogRepository) CreateWorkoutLog(ctx context.Context, workoutLog *entity.WorkoutLog) error {
	return r.db.Create(workoutLog).Error
}
