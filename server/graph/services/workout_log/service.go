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
	StartWorkout(ctx context.Context) (*model.WorkoutLog, error)
}

type workoutLogService struct {
	repo      WorkoutLogRepository
	converter *WorkoutLogConverter
	loader    loaders.SetLogsLoaderInterface
	common    common.CommonRepository
}

func NewWorkoutLogService(repo WorkoutLogRepository, converter *WorkoutLogConverter) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		common:    common.NewCommonRepository(repo.(*workoutLogRepository).db),
	}
}

func NewWorkoutLogServiceWithLoader(repo WorkoutLogRepository, converter *WorkoutLogConverter, loader loaders.SetLogsLoaderInterface) WorkoutLogService {
	return &workoutLogService{
		repo:      repo,
		converter: converter,
		loader:    loader,
		common:    common.NewCommonRepository(repo.(*workoutLogRepository).db),
	}
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
