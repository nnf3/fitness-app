package services

import (
	"app/entity"
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

func convertWorkoutLog(workoutLog entity.WorkoutLog) *model.WorkoutLog {
	return &model.WorkoutLog{
		ID:        fmt.Sprintf("%d", workoutLog.ID),
		CreatedAt: workoutLog.CreatedAt.Format(time.RFC3339),
		UpdatedAt: workoutLog.UpdatedAt.Format(time.RFC3339),
	}
}

func (s *workoutLogsService) GetWorkoutLogs(ctx context.Context, userID string) ([]*model.WorkoutLog, error) {
	entities, err := s.workoutLogLoader.LoadWorkoutLogs(ctx, userID)
	if err != nil {
		return nil, err
	}

	var result []*model.WorkoutLog
	for _, wl := range entities {
		result = append(result, convertWorkoutLog(*wl))
	}
	return result, nil
}
