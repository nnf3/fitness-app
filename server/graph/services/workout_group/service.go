package workout_group

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"app/graph/services/workout"
	"context"
	"fmt"
	"strconv"
	"time"
)

type WorkoutGroupService interface {
	GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error)
	GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error)
	GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]*model.User, error)
	CreateWorkoutGroup(ctx context.Context, input model.CreateWorkoutGroup) (*model.WorkoutGroup, error)

	// DataLoader使用メソッド
	GetWorkoutGroupWithDataLoader(ctx context.Context, id string) (*model.WorkoutGroup, error)
}

type workoutGroupService struct {
	repo        WorkoutGroupRepository
	workoutRepo workout.WorkoutRepository
	converter   *WorkoutGroupConverter
	common      common.CommonRepository
	dataLoader  *WorkoutGroupDataLoader // DataLoaderを統合
}

func NewWorkoutGroupService(repo WorkoutGroupRepository, converter *WorkoutGroupConverter, loader *WorkoutGroupDataLoader) WorkoutGroupService {
	return &workoutGroupService{
		repo:        repo,
		workoutRepo: workout.NewWorkoutRepository(repo.(*workoutGroupRepository).db),
		converter:   converter,
		common:      common.NewCommonRepository(repo.(*workoutGroupRepository).db),
		dataLoader:  loader,
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

func (s *workoutGroupService) CreateWorkoutGroup(ctx context.Context, input model.CreateWorkoutGroup) (*model.WorkoutGroup, error) {
	date, err := time.Parse(time.RFC3339, *input.Date)
	if err != nil {
		return nil, fmt.Errorf("invalid date: %s", *input.Date)
	}

	workoutGroup := &entity.WorkoutGroup{
		Title: input.Title,
		Date:  &date,
	}

	if err := s.repo.CreateWorkoutGroup(ctx, workoutGroup); err != nil {
		return nil, fmt.Errorf("failed to create workout group: %w", err)
	}

	// 作成者をメンバーに追加
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	workout := entity.Workout{
		UserID:         currentUser.ID,
		WorkoutGroupID: &workoutGroup.ID,
	}
	if err := s.workoutRepo.CreateWorkout(ctx, &workout); err != nil {
		return nil, fmt.Errorf("failed to create workout: %w", err)
	}

	return s.converter.ToModelWorkoutGroup(*workoutGroup), nil
}

// DataLoader使用メソッド
func (s *workoutGroupService) GetWorkoutGroupWithDataLoader(ctx context.Context, id string) (*model.WorkoutGroup, error) {
	entityWorkoutGroup, err := s.dataLoader.LoadByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelWorkoutGroup(*entityWorkoutGroup), nil
}
