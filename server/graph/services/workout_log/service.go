package workout_log

import (
	"app/graph/model"
	"app/graph/services/workout_log/loaders"
	"context"
	"fmt"
)

type WorkoutLogService interface {
	GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error)
}

type workoutLogService struct {
	repo      WorkoutLogRepository
	converter *WorkoutLogConverter
	loader    loaders.SetLogsLoaderForWorkoutLogInterface
}

func NewWorkoutLogService(repo WorkoutLogRepository, converter *WorkoutLogConverter) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
	}
}

func NewWorkoutLogServiceWithLoader(repo WorkoutLogRepository, converter *WorkoutLogConverter, loader loaders.SetLogsLoaderForWorkoutLogInterface) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		loader:    loader,
	}
}

func (s *workoutLogService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	workoutLogs, err := s.repo.GetWorkoutLogsByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout logs for user %s: %w", userID, err)
	}

	return s.converter.ToModelWorkoutLogsFromPointers(workoutLogs), nil
}
