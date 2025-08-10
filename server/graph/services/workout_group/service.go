package workout_group

import (
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
	"strconv"
)

type WorkoutGroupService interface {
	GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error)
	GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error)
	GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error)

	// DataLoader使用メソッド
	GetWorkoutGroupWithDataLoader(ctx context.Context, id string) (*model.WorkoutGroup, error)
}

type workoutGroupService struct {
	repo       WorkoutGroupRepository
	converter  *WorkoutGroupConverter
	common     common.CommonRepository
	dataLoader *WorkoutGroupDataLoader // DataLoaderを統合
}

func NewWorkoutGroupService(repo WorkoutGroupRepository, converter *WorkoutGroupConverter, loader *WorkoutGroupDataLoader) WorkoutGroupService {
	return &workoutGroupService{
		repo:       repo,
		converter:  converter,
		common:     common.NewCommonRepository(repo.(*workoutGroupRepository).db),
		dataLoader: loader,
	}
}

func (s *workoutGroupService) GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	userID := strconv.FormatUint(uint64(currentUser.ID), 10)

	groups, err := s.repo.GetWorkoutGroups(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get workout groups: %w", err)
	}
	return s.converter.ToModelWorkoutGroups(groups), nil
}

func (s *workoutGroupService) GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	userID := strconv.FormatUint(uint64(currentUser.ID), 10)

	group, err := s.repo.GetWorkoutGroupByID(ctx, id, userID)
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

// DataLoader使用メソッド
func (s *workoutGroupService) GetWorkoutGroupWithDataLoader(ctx context.Context, id string) (*model.WorkoutGroup, error) {
	entityWorkoutGroup, err := s.dataLoader.LoadByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelWorkoutGroup(*entityWorkoutGroup), nil
}
