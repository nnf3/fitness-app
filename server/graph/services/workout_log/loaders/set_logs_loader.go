package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type SetLogsLoaderInterface interface {
	LoadByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
}

type SetLogsLoader struct {
	*base.BaseArrayLoader[entity.SetLog]
}

func NewSetLogsLoader(db *gorm.DB) SetLogsLoaderInterface {
	loader := &SetLogsLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchSetLogsFromDB,
		loader.createSetLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *SetLogsLoader) fetchSetLogsFromDB(workoutLogIDs []uint) ([]*entity.SetLog, error) {
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

func (l *SetLogsLoader) createSetLogMap(logs []*entity.SetLog) map[uint][]*entity.SetLog {
	setLogMap := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		setLogMap[log.WorkoutLogID] = append(setLogMap[log.WorkoutLogID], log)
	}
	return setLogMap
}

func (l *SetLogsLoader) LoadByWorkoutLogID(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	return l.Load(ctx, workoutLogID)
}
