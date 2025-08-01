package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type WorkoutLogLoaderInterface interface {
	LoadWorkoutLogs(ctx context.Context, userID string) ([]*entity.WorkoutLog, error)
}

type WorkoutLogLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, []*entity.WorkoutLog]
}

func NewWorkoutLogLoader(db *gorm.DB) WorkoutLogLoaderInterface {
	loader := &WorkoutLogLoader{db: db}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

func (l *WorkoutLogLoader) fetchWorkoutLogsFromDB(userIDs []uint) ([]entity.WorkoutLog, error) {
	var logs []entity.WorkoutLog
	err := l.db.Where("user_id IN ?", userIDs).Find(&logs).Error
	return logs, err
}

func (l *WorkoutLogLoader) createResults(keyStrings []string, logs []entity.WorkoutLog) []*dataloader.Result[[]*entity.WorkoutLog] {
	workoutLogMap := make(map[uint][]*entity.WorkoutLog)
	for i := range logs {
		workoutLogMap[logs[i].UserID] = append(workoutLogMap[logs[i].UserID], &logs[i])
	}

	return CreateResultsFromMapArray[entity.WorkoutLog](keyStrings, workoutLogMap, func(key string) (uint, error) {
		if id, err := strconv.ParseUint(key, 10, 32); err == nil {
			return uint(id), nil
		}
		return 0, fmt.Errorf("invalid user ID: %s", key)
	})
}

func (l *WorkoutLogLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*entity.WorkoutLog] {
	userIDs, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[[]*entity.WorkoutLog](convertKeysToStrings(keys), fmt.Errorf("invalid user IDs"))
	}

	logs, err := l.fetchWorkoutLogsFromDB(userIDs)
	if err != nil {
		return CreateErrorResults[[]*entity.WorkoutLog](convertKeysToStrings(keys), err)
	}

	return l.createResults(convertKeysToStrings(keys), logs)
}

func (l *WorkoutLogLoader) LoadWorkoutLogs(ctx context.Context, userID string) ([]*entity.WorkoutLog, error) {
	return LoadGeneric(ctx, l.loader, StringKey(userID))
}
