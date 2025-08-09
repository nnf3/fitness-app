package exercise

import (
	"app/entity"
	"app/graph/model"
	"fmt"
)

type ExerciseConverter struct{}

func NewExerciseConverter() *ExerciseConverter {
	return &ExerciseConverter{}
}

func (c *ExerciseConverter) ToModelExercise(exercise entity.Exercise) *model.Exercise {
	return &model.Exercise{
		ID:          fmt.Sprintf("%d", exercise.ID),
		Name:        exercise.Name,
		Description: &exercise.Description,
		Category:    &exercise.Category,
	}
}

func (c *ExerciseConverter) ToModelExercises(exercises []entity.Exercise) []*model.Exercise {
	result := make([]*model.Exercise, len(exercises))
	for i, exercise := range exercises {
		result[i] = c.ToModelExercise(exercise)
	}
	return result
}

func (c *ExerciseConverter) ToModelExercisesFromPointers(exercises []*entity.Exercise) []*model.Exercise {
	result := make([]*model.Exercise, len(exercises))
	for i, exercise := range exercises {
		if exercise != nil {
			result[i] = c.ToModelExercise(*exercise)
		}
	}
	return result
}
