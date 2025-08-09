package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Model
// ================================

// WorkoutExercise returns WorkoutExerciseResolver implementation.
func (r *Resolver) WorkoutExercise() WorkoutExerciseResolver { return &workoutExerciseResolver{r} }

type workoutExerciseResolver struct{ *Resolver }

func (r *workoutExerciseResolver) Exercise(ctx context.Context, obj *model.WorkoutExercise) (*model.Exercise, error) {
	exerciseService := services.NewExerciseServiceWithSeparation(r.DB)
	return exerciseService.GetExercise(ctx, obj.Exercise.ID)
}

func (r *workoutExerciseResolver) Workout(ctx context.Context, obj *model.WorkoutExercise) (*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.GetWorkoutByID(ctx, obj.Workout.ID)
}

func (r *workoutExerciseResolver) SetLogs(ctx context.Context, obj *model.WorkoutExercise) ([]*model.SetLog, error) {
	setLogService := services.NewSetLogServiceWithSeparation(r.DB)
	return setLogService.GetSetLogsByWorkoutExerciseID(ctx, obj.ID)
}

// ================================
// Mutation
// ================================

// CreateWorkoutExercise is the resolver for the createWorkoutExercise field.
func (r *mutationResolver) CreateWorkoutExercise(ctx context.Context, input model.CreateWorkoutExercise) (*model.WorkoutExercise, error) {
	workoutExerciseService := services.NewWorkoutExerciseServiceWithSeparation(r.DB)
	return workoutExerciseService.CreateWorkoutExercise(ctx, input)
}
