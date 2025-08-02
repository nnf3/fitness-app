package set_log

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type SetLogRepository interface {
	GetSetLogsByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
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
