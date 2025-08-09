package workout_group

import (
    "app/graph/model"
		"app/graph/services/workout_group/loaders"
    "context"
    "fmt"
)

type WorkoutGroupService interface {
    GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error)
    GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error)
    GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error)
}

type workoutGroupService struct {
    repo      WorkoutGroupRepository
    converter *WorkoutGroupConverter
}

func NewWorkoutGroupServiceWithLoader(repo WorkoutGroupRepository, converter *WorkoutGroupConverter, loader loaders.WorkoutLogsLoaderForWorkoutGroupInterface) WorkoutGroupService {
    return &workoutGroupService{
        repo:      repo,
        converter: converter,
    }
}

func (s *workoutGroupService) GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error) {
    groups, err := s.repo.GetWorkoutGroups(ctx)
    if err != nil {
        return nil, fmt.Errorf("failed to get workout groups: %w", err)
    }
    return s.converter.ToModelWorkoutGroups(groups), nil
}

func (s *workoutGroupService) GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error) {
    group, err := s.repo.GetWorkoutGroupByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to get workout group %s: %w", id, err)
    }
    if group == nil {
        return nil, nil
    }
    return s.converter.ToModelWorkoutGroup(*group), nil
}

func (s *workoutGroupService) GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error) {
    users, err := s.repo.GetWorkoutGroupMembers(ctx, groupID)
    if err != nil {
        return nil, fmt.Errorf("failed to get workout group members: %w", err)
    }
    return s.converter.ToModelUsers(users), nil
}