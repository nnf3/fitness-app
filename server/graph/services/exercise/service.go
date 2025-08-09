package exercise

import (
	"app/graph/model"
	"context"
	"fmt"
)

type ExerciseService interface {
	GetExercises(ctx context.Context) ([]*model.Exercise, error)
	GetExercise(ctx context.Context, id string) (*model.Exercise, error)
}

type exerciseService struct {
	repo      ExerciseRepository
	converter *ExerciseConverter
}

func NewExerciseService(repo ExerciseRepository, converter *ExerciseConverter) ExerciseService {
	return &exerciseService{
		repo:      repo,
		converter: converter,
	}
}

func (s *exerciseService) GetExercises(ctx context.Context) ([]*model.Exercise, error) {
	exercises, err := s.repo.GetExercises(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get exercises: %w", err)
	}
	return s.converter.ToModelExercises(exercises), nil
}

func (s *exerciseService) GetExercise(ctx context.Context, id string) (*model.Exercise, error) {
	exercise, err := s.repo.GetExerciseByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get exercise %s: %w", id, err)
	}

	if exercise == nil {
		return nil, nil
	}

	return s.converter.ToModelExercise(*exercise), nil
}
