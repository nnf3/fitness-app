package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type SetLogLoaderInterface interface {
	LoadSetLogs(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
}

type SetLogLoader struct {
	*base.BaseArrayLoader[entity.SetLog]
}

func NewSetLogLoader(db *gorm.DB) SetLogLoaderInterface {
	loader := &SetLogLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchSetLogsFromDB,
		loader.createSetLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *SetLogLoader) fetchSetLogsFromDB(workoutLogIDs []uint) ([]*entity.SetLog, error) {
	var logs []entity.SetLog
	err := l.DB().Where("workout_log_id IN ?", workoutLogIDs).Find(&logs).Error
	if err != nil {
		return nil, err
	}

	// entity.SetLogのスライスを*entity.SetLogのスライスに変換
	result := make([]*entity.SetLog, len(logs))
	for i := range logs {
		result[i] = &logs[i]
	}
	return result, nil
}

func (l *SetLogLoader) createSetLogMap(logs []*entity.SetLog) map[uint][]*entity.SetLog {
	grouped := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		grouped[log.WorkoutLogID] = append(grouped[log.WorkoutLogID], log)
	}
	return grouped
}

func (l *SetLogLoader) LoadSetLogs(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	return l.Load(ctx, workoutLogID)
}
