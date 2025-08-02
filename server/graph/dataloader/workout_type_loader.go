package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type WorkoutTypeLoaderInterface interface {
	LoadWorkoutType(ctx context.Context, id string) (*entity.WorkoutType, error)
}

type WorkoutTypeLoader struct {
	*base.BaseLoader[*entity.WorkoutType]
}

func NewWorkoutTypeLoader(db *gorm.DB) WorkoutTypeLoaderInterface {
	loader := &WorkoutTypeLoader{}
	loader.BaseLoader = base.NewBaseLoader(
		db,
		loader.fetchWorkoutTypesFromDB,
		loader.createWorkoutTypeMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *WorkoutTypeLoader) fetchWorkoutTypesFromDB(ids []uint) ([]*entity.WorkoutType, error) {
	var types []*entity.WorkoutType
	err := l.DB().Find(&types, ids).Error
	return types, err
}

func (l *WorkoutTypeLoader) createWorkoutTypeMap(types []*entity.WorkoutType) map[uint]*entity.WorkoutType {
	mapped := make(map[uint]*entity.WorkoutType)
	for _, t := range types {
		mapped[t.ID] = t
	}
	return mapped
}

func (l *WorkoutTypeLoader) LoadWorkoutType(ctx context.Context, id string) (*entity.WorkoutType, error) {
	return l.Load(ctx, id)
}
