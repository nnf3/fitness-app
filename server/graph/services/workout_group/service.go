package workout_group

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"app/graph/services/user"
	"app/graph/services/workout"
	"context"
	"fmt"
	"strconv"
	"time"
)

type WorkoutGroupService interface {
	GetWorkoutGroups(ctx context.Context) ([]*model.WorkoutGroup, error)
	GetWorkoutGroup(ctx context.Context, id string) (*model.WorkoutGroup, error)
	CreateWorkoutGroup(ctx context.Context, input model.CreateWorkoutGroup) (*model.WorkoutGroup, error)
	UpdateWorkoutGroup(ctx context.Context, input model.UpdateWorkoutGroup) (*model.WorkoutGroup, error)
	DeleteWorkoutGroup(ctx context.Context, input model.DeleteWorkoutGroup) (bool, error)
	AddWorkoutGroupMember(ctx context.Context, input model.AddWorkoutGroupMember) (*model.WorkoutGroup, error)

	// DataLoader使用メソッド
	GetWorkoutGroupWithDataLoader(ctx context.Context, id string) (*model.WorkoutGroup, error)
}

type workoutGroupService struct {
	repo        WorkoutGroupRepository
	workoutRepo workout.WorkoutRepository
	userRepo    user.UserRepository
	converter   *WorkoutGroupConverter
	common      common.CommonRepository
	dataLoader  *WorkoutGroupDataLoader // DataLoaderを統合
}

func NewWorkoutGroupService(repo WorkoutGroupRepository, converter *WorkoutGroupConverter, loader *WorkoutGroupDataLoader) WorkoutGroupService {
	return &workoutGroupService{
		repo:        repo,
		workoutRepo: workout.NewWorkoutRepository(repo.(*workoutGroupRepository).db),
		userRepo:    user.NewUserRepository(repo.(*workoutGroupRepository).db),
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

func (s *workoutGroupService) CreateWorkoutGroup(ctx context.Context, input model.CreateWorkoutGroup) (*model.WorkoutGroup, error) {
	var date *time.Time
	if input.Date != nil {
		parsedDate, err := time.Parse(common.DateFormat, *input.Date)
		if err != nil {
			return nil, fmt.Errorf("invalid date: %s", *input.Date)
		}
		date = &parsedDate
	}

	var imageURL *string
	if input.ImageURL != nil {
		imageURL = input.ImageURL
	}

	workoutGroup := &entity.WorkoutGroup{
		Title:    input.Title,
		Date:     date,
		ImageURL: imageURL,
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

func (s *workoutGroupService) UpdateWorkoutGroup(ctx context.Context, input model.UpdateWorkoutGroup) (*model.WorkoutGroup, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	workoutGroup, err := s.repo.GetWorkoutGroupByID(ctx, input.ID, strconv.FormatUint(uint64(currentUser.ID), 10))
	if err != nil {
		return nil, fmt.Errorf("failed to get workout group: %w", err)
	}

	if workoutGroup == nil {
		return nil, fmt.Errorf("workout group not found")
	}

	if input.Title != nil {
		workoutGroup.Title = *input.Title
	}
	if input.Date != nil {
		parsedDate, err := time.Parse(common.DateFormat, *input.Date)
		if err != nil {
			return nil, fmt.Errorf("invalid date: %s", *input.Date)
		}
		workoutGroup.Date = &parsedDate
	}
	if input.ImageURL != nil {
		workoutGroup.ImageURL = input.ImageURL
	}

	if err := s.repo.UpdateWorkoutGroup(ctx, workoutGroup); err != nil {
		return nil, fmt.Errorf("failed to update workout group: %w", err)
	}

	return s.converter.ToModelWorkoutGroup(*workoutGroup), nil
}

func (s *workoutGroupService) DeleteWorkoutGroup(ctx context.Context, input model.DeleteWorkoutGroup) (bool, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to get current user: %w", err)
	}

	workoutGroup, err := s.repo.GetWorkoutGroupByID(ctx, input.ID, strconv.FormatUint(uint64(currentUser.ID), 10))
	if err != nil {
		return false, fmt.Errorf("failed to get workout group: %w", err)
	}

	if workoutGroup == nil {
		return false, fmt.Errorf("workout group not found")
	}

	if err := s.repo.DeleteWorkoutGroup(ctx, strconv.FormatUint(uint64(workoutGroup.ID), 10)); err != nil {
		return false, fmt.Errorf("failed to delete workout group: %w", err)
	}

	return true, nil
}

func (s *workoutGroupService) AddWorkoutGroupMember(ctx context.Context, input model.AddWorkoutGroupMember) (*model.WorkoutGroup, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	workoutGroup, err := s.repo.GetWorkoutGroupByID(ctx, input.WorkoutGroupID, strconv.FormatUint(uint64(currentUser.ID), 10))
	if err != nil {
		return nil, fmt.Errorf("failed to get workout group: %w", err)
	}

	user, err := s.userRepo.GetUserByID(ctx, input.UserID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	workout := entity.Workout{
		UserID:         user.ID,
		WorkoutGroupID: &workoutGroup.ID,
		Date:           workoutGroup.Date,
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
