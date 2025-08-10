package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Model
// ================================

func (r *Resolver) WorkoutGroup() WorkoutGroupResolver { return &workoutGroupResolver{r} }

type workoutGroupResolver struct{ *Resolver }

func (r *workoutGroupResolver) Workouts(ctx context.Context, obj *model.WorkoutGroup) ([]*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.GetWorkoutsByWorkoutGroupIDWithDataLoader(ctx, obj.ID)
}

// ================================
// Query
// ================================

// WorkoutGroups is the resolver for the workoutGroups query.
func (r *queryResolver) WorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error) {
	workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB)
	return workoutGroupService.GetWorkoutGroups(ctx)
}

// WorkoutGroup is the resolver for the workoutGroup query.
func (r *queryResolver) WorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error) {
	workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB)
	return workoutGroupService.GetWorkoutGroup(ctx, id)
}
