package set_log

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type SetLogRepository interface {
	GetSetLogsByWorkoutExerciseID(ctx context.Context, workoutExerciseID string) ([]*entity.SetLog, error)
	CreateSetLog(ctx context.Context, setLog *entity.SetLog) error
	DeleteSetLog(ctx context.Context, setLogID string) error
}

type setLogRepository struct {
	db *gorm.DB
}

func NewSetLogRepository(db *gorm.DB) SetLogRepository {
	return &setLogRepository{db: db}
}

func (r *setLogRepository) GetSetLogsByWorkoutExerciseID(ctx context.Context, workoutExerciseID string) ([]*entity.SetLog, error) {
	id, err := strconv.ParseUint(workoutExerciseID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout exercise ID: %s", workoutExerciseID)
	}

	var setLogs []entity.SetLog
	if err := r.db.Where("workout_exercise_id = ?", uint(id)).Find(&setLogs).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch set logs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.SetLog, len(setLogs))
	for i := range setLogs {
		result[i] = &setLogs[i]
	}

	return result, nil
}

func (r *setLogRepository) CreateSetLog(ctx context.Context, setLog *entity.SetLog) error {
	return r.db.Create(setLog).Error
}

func (r *setLogRepository) DeleteSetLog(ctx context.Context, setLogID string) error {
	return r.db.Delete(&entity.SetLog{}, setLogID).Error
}
