package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type WorkoutsLoaderInterface interface {
	LoadByUserID(ctx context.Context, userID string) ([]*entity.Workout, error)
}

type WorkoutsLoader struct {
	*base.BaseArrayLoader[entity.Workout]
}

func NewWorkoutsLoader(db *gorm.DB) WorkoutsLoaderInterface {
	loader := &WorkoutsLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchWorkoutsFromDB,
		loader.createWorkoutMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *WorkoutsLoader) fetchWorkoutsFromDB(userIDs []uint) ([]*entity.Workout, error) {
	var workouts []entity.Workout
	err := l.DB().Where("user_id IN ?", userIDs).Order("created_at DESC").Find(&workouts).Error
	if err != nil {
		return nil, err
	}

	// entity.WorkoutLogのスライスを*entity.WorkoutLogのスライスに変換
	result := make([]*entity.Workout, len(workouts))
	for i := range workouts {
		result[i] = &workouts[i]
	}
	return result, nil
}

func (l *WorkoutsLoader) createWorkoutMap(workouts []*entity.Workout) map[uint][]*entity.Workout {
	workoutMap := make(map[uint][]*entity.Workout)
	for _, workout := range workouts {
		workoutMap[workout.UserID] = append(workoutMap[workout.UserID], workout)
	}
	return workoutMap
}

func (l *WorkoutsLoader) LoadByUserID(ctx context.Context, userID string) ([]*entity.Workout, error) {
	return l.Load(ctx, userID)
}
