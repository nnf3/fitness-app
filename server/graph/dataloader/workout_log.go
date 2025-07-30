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

func (l *WorkoutLogLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*entity.WorkoutLog] {
	userIDs, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[[]*entity.WorkoutLog](convertKeysToStrings(keys), fmt.Errorf("invalid user IDs"))
	}

	var logs []*entity.WorkoutLog
	if err := l.db.Where("user_id IN ?", userIDs).Find(&logs).Error; err != nil {
		return CreateErrorResults[[]*entity.WorkoutLog](convertKeysToStrings(keys), err)
	}

	// グループ化
	grouped := make(map[uint][]*entity.WorkoutLog)
	for _, log := range logs {
		grouped[log.UserID] = append(grouped[log.UserID], log)
	}

	return CreateResultsFromMapArray[entity.WorkoutLog](convertKeysToStrings(keys), grouped, func(key string) (uint, error) {
		id, err := strconv.ParseUint(key, 10, 32)
		return uint(id), err
	})
}

func (l *WorkoutLogLoader) LoadWorkoutLogs(ctx context.Context, userID string) ([]*entity.WorkoutLog, error) {
	return LoadGeneric(ctx, l.loader, StringKey(userID))
}
