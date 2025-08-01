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
	GetFriendships(ctx context.Context, userID string) ([]*model.Friendship, error)
	GetFriendshipByID(ctx context.Context, friendshipID string) (*model.Friendship, error)
	GetFriendshipRequesterID(ctx context.Context, friendshipID string) (string, error)
	GetFriendshipRequesteeID(ctx context.Context, friendshipID string) (string, error)
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
		Status: model.FriendshipStatus(friendship.Status),
	}
}

func (s *friendshipService) GetFriendships(ctx context.Context, userID string) ([]*model.Friendship, error) {
	entities, err := s.friendshipLoader.LoadFriendships(ctx, userID)
	if err != nil {
		return nil, err
	}

	var result []*model.Friendship
	for _, friendship := range entities {
		result = append(result, convertFriendship(*friendship))
	}
	return result, nil
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
