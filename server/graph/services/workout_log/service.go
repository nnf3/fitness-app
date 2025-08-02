package workout_log

import (
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
)

type WorkoutLogService interface {
	GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error)
}

type workoutLogService struct {
	repo      WorkoutLogRepository
	converter *WorkoutLogConverter
	loader    dataloader.WorkoutLogLoaderInterface
}

func NewWorkoutLogService(repo WorkoutLogRepository, converter *WorkoutLogConverter, loader dataloader.WorkoutLogLoaderInterface) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		loader:    loader,
	}
}

func (s *workoutLogService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	entities, err := s.loader.LoadWorkoutLogs(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to load workout logs: %w", err)
	}

	return s.converter.ToModelWorkoutLogsFromPointers(entities), nil
}
