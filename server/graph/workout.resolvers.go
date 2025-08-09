package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Model
// ================================

// Workout returns WorkoutResolver implementation.
func (r *Resolver) Workout() WorkoutResolver { return &workoutResolver{r} }

type workoutResolver struct{ *Resolver }

// WorkoutExercises is the resolver for the workoutExercises field.
func (r *workoutResolver) WorkoutExercises(ctx context.Context, obj *model.Workout) ([]*model.WorkoutExercise, error) {
	workoutExerciseService := services.NewWorkoutExerciseServiceWithSeparation(r.DB)
	return workoutExerciseService.GetWorkoutExercisesByWorkoutIDWithDataLoader(ctx, obj.ID)
}

// ================================
// Mutation
// ================================

// StartWorkout is the resolver for the startWorkout field.
func (r *mutationResolver) StartWorkout(ctx context.Context) (*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.StartWorkout(ctx)
}
