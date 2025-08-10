package workout

import (
	"app/entity"
	"app/graph/model"
	"fmt"
	"time"
)

type WorkoutConverter struct{}

func NewWorkoutConverter() *WorkoutConverter {
	return &WorkoutConverter{}
}

func (c *WorkoutConverter) ToModelWorkout(workout entity.Workout) *model.Workout {
	var workoutGroupID *string
	if workout.WorkoutGroupID != nil {
		id := fmt.Sprintf("%d", *workout.WorkoutGroupID)
		workoutGroupID = &id
	}

	return &model.Workout{
		ID:             fmt.Sprintf("%d", workout.ID),
		CreatedAt:      workout.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      workout.UpdatedAt.Format(time.RFC3339),
		WorkoutGroupID: workoutGroupID,
	}
}

func (c *WorkoutConverter) ToModelWorkouts(workouts []entity.Workout) []*model.Workout {
	result := make([]*model.Workout, len(workouts))
	for i, workout := range workouts {
		result[i] = c.ToModelWorkout(workout)
	}
	return result
}

func (c *WorkoutConverter) ToModelWorkoutsFromPointers(workouts []*entity.Workout) []*model.Workout {
	result := make([]*model.Workout, len(workouts))
	for i, workout := range workouts {
		if workout != nil {
			result[i] = c.ToModelWorkout(*workout)
		}
	}
	return result
}
