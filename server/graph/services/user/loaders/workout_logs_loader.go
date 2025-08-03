package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type WorkoutLogsLoaderInterface interface {
	LoadByUserID(ctx context.Context, userID string) ([]*entity.WorkoutLog, error)
}

type WorkoutLogsLoader struct {
	*base.BaseArrayLoader[entity.WorkoutLog]
}

func NewWorkoutLogsLoader(db *gorm.DB) WorkoutLogsLoaderInterface {
	loader := &WorkoutLogsLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchWorkoutLogsFromDB,
		loader.createWorkoutLogMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *WorkoutLogsLoader) fetchWorkoutLogsFromDB(userIDs []uint) ([]*entity.WorkoutLog, error) {
	var logs []entity.WorkoutLog
	err := l.DB().Where("user_id IN ?", userIDs).Order("created_at DESC").Find(&logs).Error
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

func (l *WorkoutLogsLoader) createWorkoutLogMap(logs []*entity.WorkoutLog) map[uint][]*entity.WorkoutLog {
	workoutLogMap := make(map[uint][]*entity.WorkoutLog)
	for _, log := range logs {
		workoutLogMap[log.UserID] = append(workoutLogMap[log.UserID], log)
	}
	return workoutLogMap
}

func (l *WorkoutLogsLoader) LoadByUserID(ctx context.Context, userID string) ([]*entity.WorkoutLog, error) {
	return l.Load(ctx, userID)
}
