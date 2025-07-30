package services

import (
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
	"time"
)

type WorkoutLogsService interface {
	GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error)
}

type workoutLogsService struct {
	workoutLogLoader dataloader.WorkoutLogLoaderInterface
}

func NewWorkoutLogsService(loader dataloader.WorkoutLogLoaderInterface) WorkoutLogsService {
	return &workoutLogsService{workoutLogLoader: loader}
}

func (s *workoutLogsService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	entities, err := s.workoutLogLoader.LoadWorkoutLogs(ctx, userID)
	if err != nil {
		return nil, err
	}

	var result []*model.WorkoutLog
	for _, wl := range entities {
		result = append(result, &model.WorkoutLog{
			ID:        fmt.Sprintf("%d", wl.ID),
			CreatedAt: wl.CreatedAt.Format(time.RFC3339),
			UpdatedAt: wl.UpdatedAt.Format(time.RFC3339),
		})
	}
	return result, nil
}
