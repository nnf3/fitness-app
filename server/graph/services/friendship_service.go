package services

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type FriendshipService interface {
	GetFriends(ctx context.Context, userID string) ([]*model.User, error)
	GetFriendshipRequests(ctx context.Context, userID string) ([]*model.Friendship, error)
	GetRecommendedUsers(ctx context.Context, userID string) ([]*model.User, error)
	GetFriendshipByID(ctx context.Context, friendshipID string) (*model.Friendship, error)
	GetFriendshipRequesterID(ctx context.Context, friendshipID string) (string, error)
	GetFriendshipRequesteeID(ctx context.Context, friendshipID string) (string, error)
	SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error)
	AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error)
	RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error)
}

type friendshipService struct {
	db               *gorm.DB
	friendshipLoader dataloader.FriendshipLoaderInterface
}

func NewFriendshipService(db *gorm.DB, loader dataloader.FriendshipLoaderInterface) FriendshipService {
	return &friendshipService{
		db:               db,
		friendshipLoader: loader,
	}
}

func convertFriendship(friendship entity.Friendship) *model.Friendship {
	return &model.Friendship{
		ID:     fmt.Sprintf("%d", friendship.ID),
		Status: *friendship.StatusToGraphQL(),
	}
}

func (s *friendshipService) GetFriendshipByID(ctx context.Context, friendshipID string) (*model.Friendship, error) {
	friendship, err := s.GetFriendshipByIDFromEntity(ctx, friendshipID)
	if err != nil {
		return nil, err
	}
	return convertFriendship(*friendship), nil
}

// GetFriendshipByIDFromEntity はエンティティからFriendshipを取得します
func (s *friendshipService) GetFriendshipByIDFromEntity(ctx context.Context, friendshipID string) (*entity.Friendship, error) {
	id, err := strconv.ParseUint(friendshipID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid friendship ID: %s", friendshipID)
	}

	// データベースから直接取得
	var friendship entity.Friendship
	if err := s.db.Where("id = ?", uint(id)).First(&friendship).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendship: %w", err)
	}

	return &friendship, nil
}

// GetFriendshipRequesterID はFriendshipのRequesterIDを取得します
func (s *friendshipService) GetFriendshipRequesterID(ctx context.Context, friendshipID string) (string, error) {
	friendship, err := s.GetFriendshipByIDFromEntity(ctx, friendshipID)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%d", friendship.RequesterID), nil
}

// GetFriendshipRequesteeID はFriendshipのRequesteeIDを取得します
func (s *friendshipService) GetFriendshipRequesteeID(ctx context.Context, friendshipID string) (string, error) {
	friendship, err := s.GetFriendshipByIDFromEntity(ctx, friendshipID)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%d", friendship.RequesteeID), nil
}

func (s *friendshipService) GetFriends(ctx context.Context, userID string) ([]*model.User, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	friends := currentUser.GetFriends(s.db)
	var result []*model.User
	for _, friend := range friends {
		result = append(result, convertUser(friend))
	}
	return result, nil
}

func (s *friendshipService) GetFriendshipRequests(ctx context.Context, userID string) ([]*model.Friendship, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	requests := currentUser.GetFriendshipRequests(s.db)
	var result []*model.Friendship
	for _, request := range requests {
		result = append(result, convertFriendship(request))
	}
	return result, nil
}

func (s *friendshipService) GetRecommendedUsers(ctx context.Context, userID string) ([]*model.User, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}
	users := currentUser.GetRecommendedUsers(s.db)
	var result []*model.User
	for _, user := range users {
		result = append(result, convertUser(user))
	}
	return result, nil
}

func (s *friendshipService) SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	requesteeID, err := strconv.ParseUint(input.RequesteeID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid requestee ID: %s", input.RequesteeID)
	}

	friendship := entity.Friendship{
		RequesterID: currentUser.ID,
		RequesteeID: uint(requesteeID),
		Status:      string(entity.Pending),
	}

	if err := s.db.Create(&friendship).Error; err != nil {
		return nil, fmt.Errorf("failed to create friendship: %w", err)
	}

	return convertFriendship(friendship), nil
}

func (s *friendshipService) AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	friendRequest := currentUser.GetFriendshipRequest(s.db, input.FriendshipID)
	if friendRequest == nil {
		return nil, fmt.Errorf("friendship request not found")
	}

	// ステータスをAcceptedに更新
	friendRequest.Status = string(entity.Accepted)
	if err := s.db.Save(&friendRequest).Error; err != nil {
		return nil, fmt.Errorf("failed to update friendship: %w", err)
	}

	return convertFriendship(*friendRequest), nil
}

func (s *friendshipService) RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error) {
	currentUser, err := NewUserService(s.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	friendRequest := currentUser.GetFriendshipRequest(s.db, input.FriendshipID)
	if friendRequest == nil {
		return nil, fmt.Errorf("friendship request not found")
	}

	// ステータスをRejectedに更新
	friendRequest.Status = string(entity.Rejected)
	if err := s.db.Save(&friendRequest).Error; err != nil {
		return nil, fmt.Errorf("failed to update friendship: %w", err)
	}

	return convertFriendship(*friendRequest), nil
}
