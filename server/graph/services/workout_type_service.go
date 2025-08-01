package services

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
)

type WorkoutTypesService interface {
	GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error)
}

type workoutTypesService struct {
	loader dataloader.WorkoutTypeLoaderInterface
}

func NewWorkoutTypesService(loader dataloader.WorkoutTypeLoaderInterface) WorkoutTypesService {
	return &workoutTypesService{loader: loader}
}

func convertWorkoutType(workoutType entity.WorkoutType) *model.WorkoutType {
	return &model.WorkoutType{
		ID:   fmt.Sprintf("%d", workoutType.ID),
		Name: workoutType.Name,
	}
}

func (s *workoutTypesService) GetWorkoutType(ctx context.Context, id string) (*model.WorkoutType, error) {
	entity, err := s.loader.LoadWorkoutType(ctx, id)
	if err != nil {
		return nil, err
	}
	return convertWorkoutType(*entity), nil
}
