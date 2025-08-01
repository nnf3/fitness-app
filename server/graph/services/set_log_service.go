package services

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
)

type SetLogsService interface {
	GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error)
}

type setLogsService struct {
	setLogLoader      dataloader.SetLogLoaderInterface
	workoutTypeLoader dataloader.WorkoutTypeLoaderInterface
}

func NewSetLogsService(setLoader dataloader.SetLogLoaderInterface, typeLoader dataloader.WorkoutTypeLoaderInterface) SetLogsService {
	return &setLogsService{
		setLogLoader:      setLoader,
		workoutTypeLoader: typeLoader,
	}
}

func convertSetLog(setLog entity.SetLog) *model.SetLog {
	return &model.SetLog{
		ID:        fmt.Sprintf("%d", setLog.ID),
		Weight:    int32(setLog.Weight),
		RepCount:  int32(setLog.RepCount),
		SetNumber: int32(setLog.SetNumber),
	}
}

func (s *setLogsService) GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error) {
	entities, err := s.setLogLoader.LoadSetLogs(ctx, workoutLogID)
	if err != nil {
		return nil, err
	}

	var result []*model.SetLog
	for _, sl := range entities {
		result = append(result, convertSetLog(*sl))
	}
	return result, nil
}
