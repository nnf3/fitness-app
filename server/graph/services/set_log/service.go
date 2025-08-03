package set_log

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
)

type SetLogService interface {
	AddSetLog(ctx context.Context, input model.AddSetLog) (*model.SetLog, error)
}

type setLogService struct {
	repo      SetLogRepository
	converter *SetLogConverter
	common    common.CommonRepository
}

func NewSetLogService(repo SetLogRepository, converter *SetLogConverter) SetLogService {
	return &setLogService{
		repo:      repo,
		converter: converter,
		common:    common.NewCommonRepository(repo.(*setLogRepository).db),
	}
}

func (s *setLogService) AddSetLog(ctx context.Context, input model.AddSetLog) (*model.SetLog, error) {
	workoutLog, err := s.repo.GetWorkoutLogByID(ctx, input.WorkoutLogID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout log: %w", err)
	}

	workoutType, err := s.repo.GetWorkoutTypeByID(ctx, input.WorkoutTypeID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout type: %w", err)
	}

	setLogs, err := s.repo.GetSetLogsByWorkoutLogID(ctx, input.WorkoutLogID)
	if err != nil {
		return nil, fmt.Errorf("failed to get set logs: %w", err)
	}

	// workoutTypeIDでグループ化して、その中で一番大きいsetNumberを取得する
	// そのsetNumberに1を足したものをsetNumberとする
	maxSetNumber := 0
	for _, setLog := range setLogs {
		if setLog.WorkoutTypeID != workoutType.ID {
			continue
		}

		if setLog.SetNumber > maxSetNumber {
			maxSetNumber = setLog.SetNumber
		}
	}

	setLog := entity.SetLog{
		WorkoutLogID:  workoutLog.ID,
		WorkoutTypeID: workoutType.ID,
		Weight:        int(*input.Weight),
		RepCount:      int(*input.RepCount),
		SetNumber:     maxSetNumber + 1,
	}

	if err := s.repo.CreateSetLog(ctx, &setLog); err != nil {
		return nil, fmt.Errorf("failed to create set log: %w", err)
	}

	return s.converter.ToModelSetLog(setLog), nil
}
