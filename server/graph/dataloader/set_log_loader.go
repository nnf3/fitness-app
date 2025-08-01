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

func (l *SetLogLoader) fetchSetLogsFromDB(workoutLogIDs []uint) ([]entity.SetLog, error) {
	var logs []entity.SetLog
	err := l.db.Where("workout_log_id IN ?", workoutLogIDs).Find(&logs).Error
	return logs, err
}

func (l *SetLogLoader) createResults(keyStrings []string, logs []entity.SetLog) []*dataloader.Result[[]*entity.SetLog] {
	grouped := make(map[uint][]*entity.SetLog)
	for _, log := range logs {
		grouped[log.WorkoutLogID] = append(grouped[log.WorkoutLogID], &log)
	}

	return CreateResultsFromMapArray[entity.SetLog](keyStrings, grouped, func(key string) (uint, error) {
		id, err := strconv.ParseUint(key, 10, 32)
		return uint(id), err
	})
}

func (l *SetLogLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*entity.SetLog] {
	ids, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[[]*entity.SetLog](convertKeysToStrings(keys), fmt.Errorf("invalid workout log IDs"))
	}

	logs, err := l.fetchSetLogsFromDB(ids)
	if err != nil {
		return CreateErrorResults[[]*entity.SetLog](convertKeysToStrings(keys), err)
	}

	return l.createResults(convertKeysToStrings(keys), logs)
}

func (l *SetLogLoader) LoadSetLogs(ctx context.Context, workoutLogID string) ([]*entity.SetLog, error) {
	return LoadGeneric(ctx, l.loader, StringKey(workoutLogID))
}
