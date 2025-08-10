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

func (r *workoutResolver) WorkoutGroup(ctx context.Context, obj *model.Workout) (*model.WorkoutGroup, error) {
	// workoutGroupIDがnilの場合はWorkoutGroupもnilを返す
	if obj.WorkoutGroupID == nil {
		return nil, nil
	}

	workoutGroupService := services.NewWorkoutGroupServiceWithSeparation(r.DB)
	return workoutGroupService.GetWorkoutGroupWithDataLoader(ctx, *obj.WorkoutGroupID)
}

func (r *workoutResolver) User(ctx context.Context, obj *model.Workout) (*model.User, error) {
	userService := services.NewUserServiceWithSeparation(r.DB)
	return userService.GetUserByIDWithDataLoader(ctx, obj.UserID)
}

// ================================
// Mutation
// ================================

// StartWorkout is the resolver for the startWorkout field.
func (r *mutationResolver) StartWorkout(ctx context.Context, input *model.StartWorkout) (*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.StartWorkout(ctx, *input)
}
