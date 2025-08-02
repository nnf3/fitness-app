package set_log

import (
	"app/graph/dataloader"
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
	loader    dataloader.SetLogLoaderInterface
}

func NewSetLogService(repo SetLogRepository, converter *SetLogConverter, loader dataloader.SetLogLoaderInterface) SetLogService {
	return &setLogService{
		repo:      repo,
		converter: converter,
		loader:    loader,
	}
}

func (s *setLogService) GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error) {
	entities, err := s.loader.LoadSetLogs(ctx, workoutLogID)
	if err != nil {
		return nil, fmt.Errorf("failed to load set logs: %w", err)
	}

	return s.converter.ToModelSetLogsFromPointers(entities), nil
}
