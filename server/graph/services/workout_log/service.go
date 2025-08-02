package workout_log

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"app/graph/services/workout_log/loaders"
	"context"
	"fmt"
)

type WorkoutLogService interface {
	GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error)
	StartWorkout(ctx context.Context) (*model.WorkoutLog, error)
}

type workoutLogService struct {
	repo      WorkoutLogRepository
	converter *WorkoutLogConverter
	loader    loaders.SetLogsLoaderForWorkoutLogInterface
	common    common.CommonRepository
}

func NewWorkoutLogService(repo WorkoutLogRepository, converter *WorkoutLogConverter) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		common:    common.NewCommonRepository(repo.(*workoutLogRepository).db),
	}
}

func NewWorkoutLogServiceWithLoader(repo WorkoutLogRepository, converter *WorkoutLogConverter, loader loaders.SetLogsLoaderForWorkoutLogInterface) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		loader:    loader,
		common:    common.NewCommonRepository(repo.(*workoutLogRepository).db),
	}
}

func (s *workoutLogService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	workoutLogs, err := s.repo.GetWorkoutLogsByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout logs for user %s: %w", userID, err)
	}

	return s.converter.ToModelWorkoutLogsFromPointers(workoutLogs), nil
}

func (s *workoutLogService) StartWorkout(ctx context.Context) (*model.WorkoutLog, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	workoutLog := entity.WorkoutLog{
		UserID: currentUser.ID,
	}

	if err := s.repo.CreateWorkoutLog(ctx, &workoutLog); err != nil {
		return nil, fmt.Errorf("failed to create workout log: %w", err)
	}

	return s.converter.ToModelWorkoutLog(workoutLog), nil
}
