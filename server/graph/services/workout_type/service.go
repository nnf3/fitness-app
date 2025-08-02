package workout_type

import (
	"app/graph/dataloader"
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
	loader    dataloader.WorkoutTypeLoaderInterface
}

func NewWorkoutTypeService(repo WorkoutTypeRepository, converter *WorkoutTypeConverter, loader dataloader.WorkoutTypeLoaderInterface) WorkoutTypeService {
	return &workoutTypeService{
		repo:      repo,
		converter: converter,
		loader:    loader,
	}
}

func (s *workoutTypeService) GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error) {
	entity, err := s.loader.LoadWorkoutType(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to load workout type: %w", err)
	}

	if entity == nil {
		return nil, nil
	}

	return s.converter.ToModelWorkoutType(*entity), nil
}
