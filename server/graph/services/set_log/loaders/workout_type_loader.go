package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type WorkoutTypeLoaderInterface interface {
	LoadByID(ctx context.Context, id string) (*entity.WorkoutType, error)
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
	var workoutTypes []entity.WorkoutType
	if err := l.DB().Where("id IN ?", ids).Find(&workoutTypes).Error; err != nil {
		return nil, err
	}

	result := make([]*entity.WorkoutType, len(workoutTypes))
	for i, wt := range workoutTypes {
		result[i] = &wt
	}
	return result, nil
}

func (l *WorkoutTypeLoader) createWorkoutTypeMap(workoutTypes []*entity.WorkoutType) map[uint]*entity.WorkoutType {
	workoutTypeMap := make(map[uint]*entity.WorkoutType)
	for _, wt := range workoutTypes {
		workoutTypeMap[wt.ID] = wt
	}
	return workoutTypeMap
}

func (l *WorkoutTypeLoader) LoadByID(ctx context.Context, id string) (*entity.WorkoutType, error) {
	return l.Load(ctx, id)
}
