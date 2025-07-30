package services

import (
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
)

type SetLogsService interface {
	GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error)
}

type setLogsService struct {
	setLogLoader        dataloader.SetLogLoaderInterface
	workoutTypeLoader   dataloader.WorkoutTypeLoaderInterface
}

func NewSetLogsService(setLoader dataloader.SetLogLoaderInterface, typeLoader dataloader.WorkoutTypeLoaderInterface) SetLogsService {
	return &setLogsService{
		setLogLoader:      setLoader,
		workoutTypeLoader: typeLoader,
	}
}

func (s *setLogsService) GetSetLogs(ctx context.Context, workoutLogID string) ([]*model.SetLog, error) {
	entities, err := s.setLogLoader.LoadSetLogs(ctx, workoutLogID)
	if err != nil {
		return nil, err
	}

	var result []*model.SetLog
	for _, sl := range entities {
		typeEntity, err := s.workoutTypeLoader.LoadWorkoutType(ctx, fmt.Sprintf("%d", sl.WorkoutTypeID))
		if err != nil {
			return nil, err
		}
		result = append(result, &model.SetLog{
			ID:        fmt.Sprintf("%d", sl.ID),
			Weight:    sl.Weight,
			RepCount:  sl.RepCount,
			SerNumber: sl.SetNumber,
			WorkoutType: &model.WorkoutType{
				ID:   fmt.Sprintf("%d", typeEntity.ID),
				Name: typeEntity.Name,
			},
		})
	}
	return result, nil
}
