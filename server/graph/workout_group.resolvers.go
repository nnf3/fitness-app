package graph

import (
	"app/graph/model"
	"app/graph/services"
	"app/graph/services/workout_log"
	"context"
)

// ================================
// Model
// ================================

// WorkoutGroup returns WorkoutGroupResolver implementation.
func (r *Resolver) WorkoutGroup() WorkoutGroupResolver { return &workoutGroupResolver{r} }

type workoutGroupResolver struct{ *Resolver }

// WorkoutLogs is the resolver for the workoutLogs field.
func (r *workoutGroupResolver) WorkoutLogs(ctx context.Context, obj *model.WorkoutGroup) ([]*model.WorkoutLog, error) {
    // DataLoaderを使ってWorkoutLogsを取得
    workoutLogsEntities, err := r.DataLoaders.WorkoutLogsLoaderForWorkoutGroup.LoadByWorkoutGroupID(ctx, obj.ID)
    if err != nil {
        return nil, err
    }

    // エンティティからモデルに変換
    workoutLogConverter := workout_log.NewWorkoutLogConverter()
    return workoutLogConverter.ToModelWorkoutLogsFromPointers(workoutLogsEntities), nil
}

// WorkoutGroupMembers implements QueryResolver.
func (r *queryResolver) WorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error) {
	panic("unimplemented")
}

// ================================
// Query
// ================================

// WorkoutGroups is the resolver for the workoutGroups query.
func (r *queryResolver) WorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error) {
    workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB, r.DataLoaders.WorkoutLogsLoaderForWorkoutGroup)
    return workoutGroupService.GetWorkoutGroups(ctx)
}

// WorkoutGroup is the resolver for the workoutGroup query.
func (r *queryResolver) WorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error) {
    workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB, r.DataLoaders.WorkoutLogsLoaderForWorkoutGroup)
    return workoutGroupService.GetWorkoutGroup(ctx, id)
}

// WorkoutGroupMembers is the resolver for the workoutGroupMembers query.
// func (r *queryResolver) WorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error) {
//     workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB, r.DataLoaders.WorkoutLogsLoaderForWorkoutGroup)
//     return workoutGroupService.GetWorkoutGroupMembers(ctx, groupID)
// }