package workout

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
	"strconv"
	"time"
)

type WorkoutService interface {
	GetWorkoutByID(ctx context.Context, workoutID string) (*model.Workout, error)
	GetWorkoutsByUserID(ctx context.Context, userID string) ([]*model.Workout, error)
	StartWorkout(ctx context.Context, input model.StartWorkout) (*model.Workout, error)
	// DataLoader使用メソッド
	GetWorkoutByIDWithDataLoader(ctx context.Context, workoutID string) (*model.Workout, error)
	GetWorkoutsByUserIDWithDataLoader(ctx context.Context, userID string) ([]*model.Workout, error)
	GetWorkoutsByWorkoutGroupIDWithDataLoader(ctx context.Context, workoutGroupID string) ([]*model.Workout, error)
}

type workoutService struct {
	repo       WorkoutRepository
	converter  *WorkoutConverter
	common     common.CommonRepository
	dataLoader *WorkoutDataLoader // DataLoaderを統合
}

func NewWorkoutService(repo WorkoutRepository, converter *WorkoutConverter, dataLoader *WorkoutDataLoader) WorkoutService {
	return &workoutService{
		repo:       repo,
		converter:  converter,
		common:     common.NewCommonRepository(repo.(*workoutRepository).db),
		dataLoader: dataLoader,
	}
}

func (s *workoutService) GetWorkoutByID(ctx context.Context, workoutID string) (*model.Workout, error) {
	workout, err := s.repo.GetWorkoutByID(ctx, workoutID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout for workout %s: %w", workoutID, err)
	}
	return s.converter.ToModelWorkout(*workout), nil
}

func (s *workoutService) GetWorkoutsByUserID(ctx context.Context, userID string) ([]*model.Workout, error) {
	workouts, err := s.repo.GetWorkoutsByUserID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workouts for user %s: %w", userID, err)
	}
	return s.converter.ToModelWorkoutsFromPointers(workouts), nil
}

func (s *workoutService) StartWorkout(ctx context.Context, input model.StartWorkout) (*model.Workout, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	// ワークアウトグループIDの処理（オプショナル）
	var workoutGroupID *uint
	if input.WorkoutGroupID != nil {
		workoutGroupIDUint64, err := strconv.ParseUint(*input.WorkoutGroupID, 10, 32)
		if err != nil {
			return nil, fmt.Errorf("invalid workout group ID: %s", *input.WorkoutGroupID)
		}
		workoutGroupIDValue := uint(workoutGroupIDUint64)
		workoutGroupID = &workoutGroupIDValue
	}

	// 日付の処理（オプショナル）
	var date *time.Time
	if input.Date != nil {
		parsedDate, err := time.Parse(common.DateFormat, *input.Date)
		if err != nil {
			return nil, fmt.Errorf("invalid date: %s", *input.Date)
		}
		date = &parsedDate
	}

	workout := entity.Workout{
		UserID:         currentUser.ID,
		WorkoutGroupID: workoutGroupID,
		Date:           date,
	}

	if err := s.repo.CreateWorkout(ctx, &workout); err != nil {
		return nil, fmt.Errorf("failed to create workout: %w", err)
	}

	return s.converter.ToModelWorkout(workout), nil
}

// DataLoader使用メソッド
func (s *workoutService) GetWorkoutByIDWithDataLoader(ctx context.Context, workoutID string) (*model.Workout, error) {
	// 既存のDataLoaderを使用
	entityWorkout, err := s.dataLoader.LoadByID(ctx, workoutID)
	if err != nil {
		return nil, err
	}
	if entityWorkout == nil {
		return nil, nil
	}
	return s.converter.ToModelWorkout(*entityWorkout), nil
}

func (s *workoutService) GetWorkoutsByUserIDWithDataLoader(ctx context.Context, userID string) ([]*model.Workout, error) {
	// 既存のDataLoaderを使用
	entityWorkouts, err := s.dataLoader.LoadByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelWorkoutsFromPointers(entityWorkouts), nil
}

func (s *workoutService) GetWorkoutsByWorkoutGroupIDWithDataLoader(ctx context.Context, workoutGroupID string) ([]*model.Workout, error) {
	entityWorkouts, err := s.dataLoader.LoadByWorkoutGroupID(ctx, workoutGroupID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelWorkoutsFromPointers(entityWorkouts), nil
}
