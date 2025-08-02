package workout_log

import (
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
}

func NewWorkoutLogService(repo WorkoutLogRepository, converter *WorkoutLogConverter) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
	}
}

func (s *workoutLogService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	workoutLogs, err := s.repo.GetWorkoutLogsByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout logs: %w", err)
	}

	return s.converter.ToModelWorkoutLogsFromPointers(workoutLogs), nil
}
