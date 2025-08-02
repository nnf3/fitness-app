package workout_type

import (
	"app/graph/model"
	"app/graph/services/workout_type/loaders"
	"context"
	"fmt"
)

type WorkoutTypeService interface {
	GetWorkoutTypes(ctx context.Context) ([]*model.WorkoutType, error)
	GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error)
}

type workoutTypeService struct {
	repo      WorkoutTypeRepository
	converter *WorkoutTypeConverter
	loader    loaders.SetLogsLoaderForWorkoutTypeInterface
}

func NewWorkoutTypeService(repo WorkoutTypeRepository, converter *WorkoutTypeConverter) WorkoutTypeService {
	return &workoutTypeService{
		repo:      repo,
		converter: converter,
	}
}

func NewWorkoutTypeServiceWithLoader(repo WorkoutTypeRepository, converter *WorkoutTypeConverter, loader loaders.SetLogsLoaderForWorkoutTypeInterface) WorkoutTypeService {
	return &workoutTypeService{
		repo:      repo,
		converter: converter,
		loader:    loader,
	}
}

func (s *workoutTypeService) GetWorkoutTypes(ctx context.Context) ([]*model.WorkoutType, error) {
	workoutTypes, err := s.repo.GetWorkoutTypes(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout types: %w", err)
	}
	return s.converter.ToModelWorkoutTypes(workoutTypes), nil
}

func (s *workoutTypeService) GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error) {
	workoutType, err := s.repo.GetWorkoutTypeByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout type %s: %w", id, err)
	}

	if workoutType == nil {
		return nil, nil
	}

	return s.converter.ToModelWorkoutType(*workoutType), nil
}
