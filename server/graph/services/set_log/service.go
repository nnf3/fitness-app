package set_log

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
	"strconv"
)

type SetLogService interface {
	GetSetLogsByWorkoutExerciseID(ctx context.Context, workoutExerciseID string) ([]*model.SetLog, error)
	CreateSetLog(ctx context.Context, input model.CreateSetLog) (*model.SetLog, error)
	DeleteSetLog(ctx context.Context, input model.DeleteSetLog) (bool, error)
	// DataLoader使用メソッド
	GetSetLogsByWorkoutExerciseIDWithDataLoader(ctx context.Context, workoutExerciseID string) ([]*model.SetLog, error)
}

type setLogService struct {
	repo       SetLogRepository
	converter  *SetLogConverter
	common     common.CommonRepository
	dataLoader *SetLogDataLoader // DataLoaderを統合
}

func NewSetLogService(repo SetLogRepository, converter *SetLogConverter, dataLoader *SetLogDataLoader) SetLogService {
	return &setLogService{
		repo:       repo,
		converter:  converter,
		common:     common.NewCommonRepository(repo.(*setLogRepository).db),
		dataLoader: dataLoader,
	}
}

func (s *setLogService) GetSetLogsByWorkoutExerciseID(ctx context.Context, workoutExerciseID string) ([]*model.SetLog, error) {
	setLogs, err := s.repo.GetSetLogsByWorkoutExerciseID(ctx, workoutExerciseID)
	if err != nil {
		return nil, fmt.Errorf("failed to get set logs for workout exercise %s: %w", workoutExerciseID, err)
	}
	return s.converter.ToModelSetLogsFromPointers(setLogs), nil
}

func (s *setLogService) CreateSetLog(ctx context.Context, input model.CreateSetLog) (*model.SetLog, error) {
	workoutExerciseID, err := strconv.ParseUint(input.WorkoutExerciseID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout exercise ID: %s", input.WorkoutExerciseID)
	}

	setLog := entity.SetLog{
		WorkoutExerciseID: uint(workoutExerciseID),
		Weight:            int(*input.Weight),
		RepCount:          int(*input.RepCount),
		SetNumber:         int(input.SetNumber),
	}

	if err := s.repo.CreateSetLog(ctx, &setLog); err != nil {
		return nil, fmt.Errorf("failed to create set log: %w", err)
	}

	return s.converter.ToModelSetLog(setLog), nil
}

func (s *setLogService) DeleteSetLog(ctx context.Context, input model.DeleteSetLog) (bool, error) {
	if err := s.repo.DeleteSetLog(ctx, input.SetLogID); err != nil {
		return false, fmt.Errorf("failed to delete set log: %w", err)
	}
	return true, nil
}

// DataLoader使用メソッド
func (s *setLogService) GetSetLogsByWorkoutExerciseIDWithDataLoader(ctx context.Context, workoutExerciseID string) ([]*model.SetLog, error) {
	// 既存のDataLoaderを使用
	entitySetLogs, err := s.dataLoader.LoadByWorkoutExerciseID(ctx, workoutExerciseID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelSetLogsFromPointers(entitySetLogs), nil
}
