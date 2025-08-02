package friendship

import (
	"app/entity"
	"app/middleware"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type FriendshipRepository interface {
	GetFriendshipByID(ctx context.Context, friendshipID string) (*entity.Friendship, error)
	GetFriendsByUserID(ctx context.Context, userID string) ([]*entity.User, error)
	GetFriendshipRequestsByUserID(ctx context.Context, userID string) ([]*entity.Friendship, error)
	GetRecommendedUsersByUserID(ctx context.Context, userID string) ([]*entity.User, error)
	CreateFriendship(ctx context.Context, friendship *entity.Friendship) error
	UpdateFriendship(ctx context.Context, friendship *entity.Friendship) error
	GetDB() *gorm.DB
}

type friendshipRepository struct {
	db *gorm.DB
}

func NewFriendshipRepository(db *gorm.DB) FriendshipRepository {
	return &friendshipRepository{db: db}
}

func (r *friendshipRepository) GetFriendshipByID(ctx context.Context, friendshipID string) (*entity.Friendship, error) {
	id, err := strconv.ParseUint(friendshipID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid friendship ID: %s", friendshipID)
	}

	var friendship entity.Friendship
	if err := r.db.Where("id = ?", uint(id)).First(&friendship).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendship: %w", err)
	}

	return &friendship, nil
}

func (r *friendshipRepository) GetFriendsByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	// 現在のユーザーを取得
	uid, err := getUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var currentUser entity.User
	if err := r.db.Where("uid = ?", uid).First(&currentUser).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch current user: %w", err)
	}

	// 友達を取得
	friends := currentUser.GetFriends(r.db)
	// 値のスライスをポインタのスライスに変換
	friendPointers := make([]*entity.User, len(friends))
	for i := range friends {
		friendPointers[i] = &friends[i]
	}
	return friendPointers, nil
}

func (r *friendshipRepository) GetFriendshipRequestsByUserID(ctx context.Context, userID string) ([]*entity.Friendship, error) {
	// 現在のユーザーを取得
	uid, err := getUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var currentUser entity.User
	if err := r.db.Where("uid = ?", uid).First(&currentUser).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch current user: %w", err)
	}

	// 友達リクエストを取得
	requests := currentUser.GetFriendshipRequests(r.db)
	// 値のスライスをポインタのスライスに変換
	requestPointers := make([]*entity.Friendship, len(requests))
	for i := range requests {
		requestPointers[i] = &requests[i]
	}
	return requestPointers, nil
}

func (r *friendshipRepository) GetRecommendedUsersByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	// 現在のユーザーを取得
	uid, err := getUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var currentUser entity.User
	if err := r.db.Where("uid = ?", uid).First(&currentUser).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch current user: %w", err)
	}

	// 推奨ユーザーを取得
	users := currentUser.GetRecommendedUsers(r.db)
	// 値のスライスをポインタのスライスに変換
	userPointers := make([]*entity.User, len(users))
	for i := range users {
		userPointers[i] = &users[i]
	}
	return userPointers, nil
}

func (r *friendshipRepository) CreateFriendship(ctx context.Context, friendship *entity.Friendship) error {
	return r.db.Create(friendship).Error
}

func (r *friendshipRepository) UpdateFriendship(ctx context.Context, friendship *entity.Friendship) error {
	return r.db.Save(friendship).Error
}

func (r *friendshipRepository) GetDB() *gorm.DB {
	return r.db
}

// ヘルパー関数
func getUserUIDFromContext(ctx context.Context) (string, error) {
	return middleware.GetUserUIDFromContext(ctx)
}
