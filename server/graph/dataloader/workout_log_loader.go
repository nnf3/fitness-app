package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type WorkoutLogLoaderInterface interface {
	LoadWorkoutLogs(ctx context.Context, userID string) ([]*entity.WorkoutLog, error)
}

type WorkoutLogLoader struct {
	*base.BaseArrayLoader[entity.WorkoutLog]
}

func NewWorkoutLogLoader(db *gorm.DB) WorkoutLogLoaderInterface {
	loader := &WorkoutLogLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchWorkoutLogsFromDB,
		loader.createWorkoutLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *WorkoutLogLoader) fetchWorkoutLogsFromDB(userIDs []uint) ([]*entity.WorkoutLog, error) {
	var logs []entity.WorkoutLog
	err := l.DB().Where("user_id IN ?", userIDs).Find(&logs).Error
	if err != nil {
		return nil, err
	}

	// entity.WorkoutLogのスライスを*entity.WorkoutLogのスライスに変換
	result := make([]*entity.WorkoutLog, len(logs))
	for i := range logs {
		result[i] = &logs[i]
	}
	return result, nil
}

func (l *WorkoutLogLoader) createWorkoutLogMap(logs []*entity.WorkoutLog) map[uint][]*entity.WorkoutLog {
	workoutLogMap := make(map[uint][]*entity.WorkoutLog)
	for _, log := range logs {
		workoutLogMap[log.UserID] = append(workoutLogMap[log.UserID], log)
	}
	return workoutLogMap
}

func (l *WorkoutLogLoader) LoadWorkoutLogs(ctx context.Context, userID string) ([]*entity.WorkoutLog, error) {
	return l.Load(ctx, userID)
}
