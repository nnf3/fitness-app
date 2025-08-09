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
	// Batch methods for DataLoader
	GetFriendshipsByIDs(friendshipIDs []uint) ([]*entity.Friendship, error)
	GetFriendsByUserIDs(userIDs []uint) ([]*entity.User, error)
	GetFriendshipsByUserIDs(userIDs []uint) ([]*entity.Friendship, error)
	GetFriendshipRequestsByUserIDs(userIDs []uint) ([]*entity.Friendship, error)
	GetRecommendedUsersByUserIDs(userIDs []uint) ([]*entity.User, error)
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

// Batch methods for DataLoader
func (r *friendshipRepository) GetFriendshipsByIDs(friendshipIDs []uint) ([]*entity.Friendship, error) {
	if len(friendshipIDs) == 0 {
		return []*entity.Friendship{}, nil
	}

	var friendships []entity.Friendship
	if err := r.db.Where("id IN ?", friendshipIDs).Find(&friendships).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendships by IDs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Friendship, len(friendships))
	for i := range friendships {
		result[i] = &friendships[i]
	}

	return result, nil
}

func (r *friendshipRepository) GetFriendsByUserIDs(userIDs []uint) ([]*entity.User, error) {
	if len(userIDs) == 0 {
		return []*entity.User{}, nil
	}

	// GetFriendsByUserIDの実装を参考に、バッチで友達を取得
	var friendships []entity.Friendship
	if err := r.db.Model(&entity.Friendship{}).
		Preload("Requester").
		Preload("Requestee").
		Where("(requester_id IN ? OR requestee_id IN ?) AND status = ?", userIDs, userIDs, string(entity.Accepted)).
		Find(&friendships).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendships by user IDs: %w", err)
	}

	// 全ての友達ユーザーを収集（重複排除）
	friendsSet := make(map[uint]*entity.User)

	for _, friendship := range friendships {
		// 対象userIDsに含まれるユーザーの友達を収集
		for _, userID := range userIDs {
			if friendship.RequesterID == userID && friendship.Requestee.ID != 0 {
				friendsSet[friendship.Requestee.ID] = &friendship.Requestee
			} else if friendship.RequesteeID == userID && friendship.Requester.ID != 0 {
				friendsSet[friendship.Requester.ID] = &friendship.Requester
			}
		}
	}

	// 結果を構築
	result := make([]*entity.User, 0, len(friendsSet))
	for _, friend := range friendsSet {
		result = append(result, friend)
	}

	return result, nil
}

func (r *friendshipRepository) GetFriendshipsByUserIDs(userIDs []uint) ([]*entity.Friendship, error) {
	if len(userIDs) == 0 {
		return []*entity.Friendship{}, nil
	}

	// 友達関係データを取得（承認済みのみ）
	var friendships []entity.Friendship
	if err := r.db.Model(&entity.Friendship{}).
		Preload("Requester").
		Preload("Requestee").
		Where("(requester_id IN ? OR requestee_id IN ?) AND status = ?", userIDs, userIDs, string(entity.Accepted)).
		Find(&friendships).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendships by user IDs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Friendship, len(friendships))
	for i := range friendships {
		result[i] = &friendships[i]
	}

	return result, nil
}

func (r *friendshipRepository) GetFriendshipRequestsByUserIDs(userIDs []uint) ([]*entity.Friendship, error) {
	if len(userIDs) == 0 {
		return []*entity.Friendship{}, nil
	}

	// GetFriendshipRequestsByUserIDの実装を参考に、バッチで友達リクエストを取得
	var friendships []entity.Friendship
	if err := r.db.Model(&entity.Friendship{}).
		Where("requestee_id IN ? AND status = ?", userIDs, string(entity.Pending)).
		Find(&friendships).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch friendship requests by user IDs: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.Friendship, len(friendships))
	for i := range friendships {
		result[i] = &friendships[i]
	}

	return result, nil
}

func (r *friendshipRepository) GetRecommendedUsersByUserIDs(userIDs []uint) ([]*entity.User, error) {
	if len(userIDs) == 0 {
		return []*entity.User{}, nil
	}

	// GetRecommendedUsersByUserIDの実装を参考に、バッチで推奨ユーザーを取得
	// 各ユーザーと友達関係にあるユーザーIDを取得
	var excludeIDsForAll []uint
	for _, userID := range userIDs {
		var excludeIDs []uint
		if err := r.db.Model(&entity.Friendship{}).
			Select("CASE WHEN requester_id = ? THEN requestee_id ELSE requester_id END", userID).
			Where("requester_id = ? OR requestee_id = ?", userID, userID).
			Scan(&excludeIDs).Error; err != nil {
			continue // エラーの場合はスキップ
		}

		// 現在のユーザーも除外リストに追加
		excludeIDs = append(excludeIDs, userID)
		excludeIDsForAll = append(excludeIDsForAll, excludeIDs...)
	}

	// 重複を除去
	excludeSet := make(map[uint]bool)
	for _, id := range excludeIDsForAll {
		excludeSet[id] = true
	}

	var finalExcludeIDs []uint
	for id := range excludeSet {
		finalExcludeIDs = append(finalExcludeIDs, id)
	}

	// 除外リストに含まれないユーザーを推奨ユーザーとして取得
	var recommendedUsers []entity.User
	query := r.db.Model(&entity.User{})
	if len(finalExcludeIDs) > 0 {
		query = query.Where("id NOT IN ?", finalExcludeIDs)
	}

	if err := query.Limit(50).Find(&recommendedUsers).Error; err != nil { // 適度な制限を設定
		return nil, fmt.Errorf("failed to fetch recommended users: %w", err)
	}

	// 値のスライスをポインタのスライスに変換
	result := make([]*entity.User, len(recommendedUsers))
	for i := range recommendedUsers {
		result[i] = &recommendedUsers[i]
	}

	return result, nil
}

// ヘルパー関数
func getUserUIDFromContext(ctx context.Context) (string, error) {
	return middleware.GetUserUIDFromContext(ctx)
}
