package workout_type

import (
	"app/graph/model"
	"context"
	"fmt"
)

type WorkoutTypeService interface {
	GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error)
}

type workoutTypeService struct {
	repo      WorkoutTypeRepository
	converter *WorkoutTypeConverter
}

func NewWorkoutTypeService(repo WorkoutTypeRepository, converter *WorkoutTypeConverter) WorkoutTypeService {
	return &workoutTypeService{
		repo:      repo,
		converter: converter,
	}
}

func (s *workoutTypeService) GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error) {
	workoutType, err := s.repo.GetWorkoutTypeByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout type: %w", err)
	}

	if workoutType == nil {
		return nil, nil
	}

	return s.converter.ToModelWorkoutType(*workoutType), nil
}
