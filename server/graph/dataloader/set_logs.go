package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type SetLogLoaderInterface interface {
	LoadSetLogs(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error)
}

type SetLogLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, []*entity.SetLog]
}

func NewSetLogLoader(db *gorm.DB) SetLogLoaderInterface {
	loader := &SetLogLoader{db: db}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

func (l *SetLogLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*entity.SetLog] {
	ids, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[[]*entity.SetLog](convertKeysToStrings(keys), fmt.Errorf("invalid workout log IDs"))
	}

	var logs []*entity.SetLog
	if err := l.db.Where("workout_log_id IN ?", ids).Find(&logs).Error; err != nil {
		return CreateErrorResults[[]*entity.SetLog](convertKeysToStrings(keys), err)
	}

	grouped := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		grouped[log.WorkoutLogID] = append(grouped[log.WorkoutLogID], log)
	}

	return CreateResultsFromMapArray[entity.SetLog](convertKeysToStrings(keys), grouped, func(key string) (uint, error) {
		id, err := strconv.ParseUint(key, 10, 32)
		return uint(id), err
	})
}

func (l *SetLogLoader) LoadSetLogs(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	return LoadGeneric(ctx, l.loader, StringKey(workoutLogID))
}
