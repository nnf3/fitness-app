package workout_type

import (
	"app/entity"
	"app/graph/model"
	"fmt"
)

type WorkoutTypeConverter struct{}

func NewWorkoutTypeConverter() *WorkoutTypeConverter {
	return &WorkoutTypeConverter{}
}

func (c *WorkoutTypeConverter) ToModelWorkoutType(workoutType entity.WorkoutType) *model.WorkoutType {
	return &model.WorkoutType{
		ID:   fmt.Sprintf("%d", workoutType.ID),
		Name: workoutType.Name,
	}
}

func (c *WorkoutTypeConverter) ToModelWorkoutTypes(workoutTypes []entity.WorkoutType) []*model.WorkoutType {
	result := make([]*model.WorkoutType, len(workoutTypes))
	for i, workoutType := range workoutTypes {
		result[i] = c.ToModelWorkoutType(workoutType)
	}
	return result
}

func (c *WorkoutTypeConverter) ToModelWorkoutTypesFromPointers(workoutTypes []*entity.WorkoutType) []*model.WorkoutType {
	result := make([]*model.WorkoutType, len(workoutTypes))
	for i, workoutType := range workoutTypes {
		if workoutType != nil {
			result[i] = c.ToModelWorkoutType(*workoutType)
		}
	}
	return result
}
