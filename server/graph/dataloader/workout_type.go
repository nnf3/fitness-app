package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type WorkoutTypeLoaderInterface interface {
	LoadWorkoutType(ctx context.Context, id string) (*entity.WorkoutType, error)
}

type WorkoutTypeLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, *entity.WorkoutType]
}

func NewWorkoutTypeLoader(db *gorm.DB) WorkoutTypeLoaderInterface {
	loader := &WorkoutTypeLoader{db: db}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

func (l *WorkoutTypeLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[*entity.WorkoutType] {
	ids, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[*entity.WorkoutType](convertKeysToStrings(keys), fmt.Errorf("invalid workout type IDs"))
	}

	var types []*entity.WorkoutType
	if err := l.db.Find(&types, ids).Error; err != nil {
		return CreateErrorResults[*entity.WorkoutType](convertKeysToStrings(keys), err)
	}

	mapped := make(map[uint]*entity.WorkoutType)
	for _, t := range types {
		mapped[t.ID] = t
	}

	return CreateResultsFromMap(convertKeysToStrings(keys), mapped, func(key string) (uint, error) {
		id, err := strconv.ParseUint(key, 10, 32)
		return uint(id), err
	})
}

func (l *WorkoutTypeLoader) LoadWorkoutType(ctx context.Context, id string) (*entity.WorkoutType, error) {
	return LoadGeneric(ctx, l.loader, StringKey(id))
}
