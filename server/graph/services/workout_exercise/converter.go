package workout_exercise

import (
	"app/entity"
	"app/graph/model"
	"fmt"
)

type WorkoutExerciseConverter struct{}

func NewWorkoutExerciseConverter() *WorkoutExerciseConverter {
	return &WorkoutExerciseConverter{}
}

func (c *WorkoutExerciseConverter) ToModelWorkoutExercise(workoutExercise entity.WorkoutExercise) *model.WorkoutExercise {
	return &model.WorkoutExercise{
		ID: fmt.Sprintf("%d", workoutExercise.ID),
		Workout: &model.Workout{
			ID: fmt.Sprintf("%d", workoutExercise.WorkoutID),
		},
		Exercise: &model.Exercise{
			ID: fmt.Sprintf("%d", workoutExercise.ExerciseID),
		},
	}
}

func (c *WorkoutExerciseConverter) ToModelWorkoutExercises(workoutExercises []entity.WorkoutExercise) []*model.WorkoutExercise {
	result := make([]*model.WorkoutExercise, len(workoutExercises))
	for i, workoutExercise := range workoutExercises {
		result[i] = c.ToModelWorkoutExercise(workoutExercise)
	}
	return result
}

func (c *WorkoutExerciseConverter) ToModelWorkoutExercisesFromPointers(workoutExercises []*entity.WorkoutExercise) []*model.WorkoutExercise {
	result := make([]*model.WorkoutExercise, len(workoutExercises))
	for i, workoutExercise := range workoutExercises {
		if workoutExercise != nil {
			result[i] = c.ToModelWorkoutExercise(*workoutExercise)
		}
	}
	return result
}
