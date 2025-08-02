package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type SetLogsLoaderForWorkoutTypeInterface interface {
	LoadByWorkoutTypeID(ctx context.Context, workoutTypeID string) ([]*entity.SetLog, error)
}

type SetLogsLoaderForWorkoutType struct {
	*base.BaseArrayLoader[entity.SetLog]
}

func NewSetLogsLoaderForWorkoutType(db *gorm.DB) SetLogsLoaderForWorkoutTypeInterface {
	loader := &SetLogsLoaderForWorkoutType{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchSetLogsFromDB,
		loader.createSetLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *SetLogsLoaderForWorkoutType) fetchSetLogsFromDB(workoutTypeIDs []uint) ([]*entity.SetLog, error) {
	var logs []entity.SetLog
	err := l.DB().Where("workout_type_id IN ?", workoutTypeIDs).Find(&logs).Error
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

func (l *SetLogsLoaderForWorkoutType) createSetLogMap(logs []*entity.SetLog) map[uint][]*entity.SetLog {
	setLogMap := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		setLogMap[log.WorkoutTypeID] = append(setLogMap[log.WorkoutTypeID], log)
	}
	return setLogMap
}

func (l *SetLogsLoaderForWorkoutType) LoadByWorkoutTypeID(ctx context.Context, workoutTypeID string) ([]*entity.SetLog, error) {
	return l.Load(ctx, workoutTypeID)
}
