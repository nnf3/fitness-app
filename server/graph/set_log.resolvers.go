package graph

import (
	"app/graph/model"
	"app/graph/services"
	"app/graph/services/workout_type"
	"context"
	"fmt"
)

// ================================
// Model
// ================================

// SetLog returns SetLogResolver implementation.
func (r *Resolver) SetLog() SetLogResolver { return &setLogResolver{r} }

type setLogResolver struct{ *Resolver }

// WorkoutLog is the resolver for the workoutLog field.
func (r *setLogResolver) WorkoutLog(ctx context.Context, obj *model.SetLog) (*model.WorkoutLog, error) {
	// TODO: Implement WorkoutLog resolver for SetLog
	return nil, fmt.Errorf("not implemented: WorkoutLog - workoutLog")
}

// WorkoutType is the resolver for the workoutType field.
func (r *setLogResolver) WorkoutType(ctx context.Context, obj *model.SetLog) (*model.WorkoutType, error) {
	workoutTypeEntity, err := r.DataLoaders.WorkoutTypeLoaderForSetLog.LoadByID(ctx, obj.WorkoutTypeID)
	if err != nil {
		return nil, err
	}
	if workoutTypeEntity == nil {
		return nil, nil
	}

	// エンティティからモデルに変換
	workoutTypeConverter := workout_type.NewWorkoutTypeConverter()
	return workoutTypeConverter.ToModelWorkoutType(*workoutTypeEntity), nil
}

// ================================
// Mutation
// ================================

// AddSetLog is the resolver for the addSetLog field.
func (r *mutationResolver) AddSetLog(ctx context.Context, input model.AddSetLog) (*model.SetLog, error) {
	setLogService := services.NewSetLogServiceWithSeparation(r.DB)
	return setLogService.AddSetLog(ctx, input)
}
