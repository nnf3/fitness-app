package graph

import (
	"app/graph/model"
	"app/graph/services"
	"app/graph/services/set_log"
	"context"
)

// ================================
// Model
// ================================

// WorkoutLog returns WorkoutLogResolver implementation.
func (r *Resolver) WorkoutLog() WorkoutLogResolver { return &workoutLogResolver{r} }

type workoutLogResolver struct{ *Resolver }

// SetLogs is the resolver for the setLogs field.
func (r *workoutLogResolver) SetLogs(ctx context.Context, obj *model.WorkoutLog) ([]*model.SetLog, error) {
	setLogsEntities, err := r.DataLoaders.SetLogsLoaderForWorkoutLogDirect.LoadByWorkoutLogID(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	// エンティティからモデルに変換
	setLogConverter := set_log.NewSetLogConverter()
	return setLogConverter.ToModelSetLogsFromPointers(setLogsEntities), nil
}

// ================================
// Mutation
// ================================

// StartWorkout is the resolver for the startWorkout field.
func (r *mutationResolver) StartWorkout(ctx context.Context, input *model.StartWorkoutInput) (*model.WorkoutLog, error) {
	workoutLogService := services.NewWorkoutLogServiceWithSeparation(r.DB, r.DataLoaders.SetLogsLoaderForWorkoutLog)
	return workoutLogService.StartWorkout(ctx)
}
