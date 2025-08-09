package workout

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
)

type WorkoutService interface {
	GetWorkoutByID(ctx context.Context, workoutID string) (*model.Workout, error)
	GetWorkoutsByUserID(ctx context.Context, userID string) ([]*model.Workout, error)
	StartWorkout(ctx context.Context) (*model.Workout, error)
}

type workoutService struct {
	repo      WorkoutRepository
	converter *WorkoutConverter
	common    common.CommonRepository
}

func NewWorkoutService(repo WorkoutRepository, converter *WorkoutConverter) WorkoutService {
	return &workoutService{
		repo:      repo,
		converter: converter,
		common:    common.NewCommonRepository(repo.(*workoutRepository).db),
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

func (s *workoutService) StartWorkout(ctx context.Context) (*model.Workout, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	workout := entity.Workout{
		UserID: currentUser.ID,
	}

	if err := s.repo.CreateWorkout(ctx, &workout); err != nil {
		return nil, fmt.Errorf("failed to create workout: %w", err)
	}

	return s.converter.ToModelWorkout(workout), nil
}
