package set_log

import (
	"app/graph/model"
	"context"
	"fmt"
)

type SetLogService interface {
	GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error)
}

type setLogService struct {
	repo      SetLogRepository
	converter *SetLogConverter
}

func NewSetLogService(repo SetLogRepository, converter *SetLogConverter) SetLogService {
	return &setLogService{
		repo:      repo,
		converter: converter,
	}
}

func (s *setLogService) GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error) {
	setLogs, err := s.repo.GetSetLogsByWorkoutLogID(ctx, workoutLogID)
	if err != nil {
		return nil, fmt.Errorf("failed to get set logs: %w", err)
	}

	return s.converter.ToModelSetLogsFromPointers(setLogs), nil
}
