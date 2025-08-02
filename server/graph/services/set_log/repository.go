package set_log

import (
	"app/entity"
	"app/graph/services/common"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type SetLogRepository interface {
	GetSetLogsByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
	GetWorkoutLogByID(ctx context.Context, workoutLogID string) (*entity.WorkoutLog, error)
	GetWorkoutTypeByID(ctx context.Context, workoutTypeID string) (*entity.WorkoutType, error)
	CreateSetLog(ctx context.Context, setLog *entity.SetLog) error
}

type setLogRepository struct {
	db *gorm.DB
}

func NewSetLogRepository(db *gorm.DB) SetLogRepository {
	return &setLogRepository{db: db}
}

func (r *setLogRepository) GetSetLogsByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	id, err := strconv.ParseUint(workoutLogID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout log ID: %s", workoutLogID)
	}

	var setLogs []entity.SetLog
	if err := r.db.Where("workout_log_id = ?", uint(id)).Find(&setLogs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch set logs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.SetLog, len(setLogs))
	for i := range setLogs {
		result[i] = &setLogs[i]
	}

	return result, nil
}

func (r *setLogRepository) GetWorkoutLogByID(ctx context.Context, workoutLogID string) (*entity.WorkoutLog, error) {
	currentUser, err := common.NewCommonRepository(r.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	id, err := strconv.ParseUint(workoutLogID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout log ID: %s", workoutLogID)
	}

	var workoutLog entity.WorkoutLog
	if err := r.db.Where("user_id = ? AND id = ?", currentUser.ID, uint(id)).First(&workoutLog).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout log: %w", err)
	}

	return &workoutLog, nil
}

func (r *setLogRepository) GetWorkoutTypeByID(ctx context.Context, workoutTypeID string) (*entity.WorkoutType, error) {
	id, err := strconv.ParseUint(workoutTypeID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout type ID: %s", workoutTypeID)
	}

	var workoutType entity.WorkoutType
	if err := r.db.Where("id = ?", uint(id)).First(&workoutType).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch workout type: %w", err)
	}

	return &workoutType, nil
}

func (r *setLogRepository) CreateSetLog(ctx context.Context, setLog *entity.SetLog) error {
	return r.db.Create(setLog).Error
}
