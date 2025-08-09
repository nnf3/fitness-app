package workout_exercise

import (
	"app/entity"
	"app/graph/model"
	"context"
	"fmt"
	"strconv"
)

type WorkoutExerciseService interface {
	GetWorkoutExercisesByWorkoutID(ctx context.Context, workoutID string) ([]*model.WorkoutExercise, error)
	CreateWorkoutExercise(ctx context.Context, input model.CreateWorkoutExercise) (*model.WorkoutExercise, error)
}

type workoutExerciseService struct {
	repo      WorkoutExerciseRepository
	converter *WorkoutExerciseConverter
}

func NewWorkoutExerciseService(repo WorkoutExerciseRepository, converter *WorkoutExerciseConverter) WorkoutExerciseService {
	return &workoutExerciseService{
		repo:      repo,
		converter: converter,
	}
}

func (s *workoutExerciseService) GetWorkoutExercisesByWorkoutID(ctx context.Context, workoutID string) ([]*model.WorkoutExercise, error) {
	workoutExercises, err := s.repo.GetWorkoutExercisesByWorkoutID(ctx, workoutID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout exercises for workout %s: %w", workoutID, err)
	}
	return s.converter.ToModelWorkoutExercises(workoutExercises), nil
}

func (s *workoutExerciseService) CreateWorkoutExercise(ctx context.Context, input model.CreateWorkoutExercise) (*model.WorkoutExercise, error) {
	workoutID, err := strconv.ParseUint(input.WorkoutID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid workout ID: %s", input.WorkoutID)
	}

	exerciseID, err := strconv.ParseUint(input.ExerciseID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid exercise ID: %s", input.ExerciseID)
	}

	workoutExercise := &entity.WorkoutExercise{
		WorkoutID:  uint(workoutID),
		ExerciseID: uint(exerciseID),
	}

	if err := s.repo.CreateWorkoutExercise(ctx, workoutExercise); err != nil {
		return nil, fmt.Errorf("failed to create workout exercise: %w", err)
	}

	return s.converter.ToModelWorkoutExercise(*workoutExercise), nil
}
