package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type SetLogsLoaderForWorkoutLogInterface interface {
	LoadByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
}

type SetLogsLoaderForWorkoutLog struct {
	*base.BaseArrayLoader[entity.SetLog]
}

func NewSetLogsLoaderForWorkoutLog(db *gorm.DB) SetLogsLoaderForWorkoutLogInterface {
	loader := &SetLogsLoaderForWorkoutLog{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchSetLogsFromDB,
		loader.createSetLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *SetLogsLoaderForWorkoutLog) fetchSetLogsFromDB(workoutLogIDs []uint) ([]*entity.SetLog, error) {
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

func (l *SetLogsLoaderForWorkoutLog) createSetLogMap(logs []*entity.SetLog) map[uint][]*entity.SetLog {
	setLogMap := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		setLogMap[log.WorkoutLogID] = append(setLogMap[log.WorkoutLogID], log)
	}
	return setLogMap
}

func (l *SetLogsLoaderForWorkoutLog) LoadByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	return l.Load(ctx, workoutLogID)
}
