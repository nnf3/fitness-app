package friendship

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// FriendshipDataLoader は Friendship エンティティの遅延ローディングを担当
type FriendshipDataLoader struct {
	repository                FriendshipRepository
	byIDLoader                *base.BaseLoader[*entity.Friendship]
	friendshipsByUserIDLoader *base.BaseArrayLoader[entity.Friendship]
	requestsByUserIDLoader    *base.BaseArrayLoader[entity.Friendship]
	recommendedByUserIDLoader *base.BaseArrayLoader[entity.User]
}

// NewFriendshipDataLoader は新しいDataLoaderを作成
func NewFriendshipDataLoader(repository FriendshipRepository) *FriendshipDataLoader {
	loader := &FriendshipDataLoader{
		repository: repository,
	}

	// ByID用のローダー
	loader.byIDLoader = base.NewBaseLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByIDs,
		loader.createIDMap,
		base.ParseUintKey,
	)

	// FriendshipsByUserID用のローダー
	loader.friendshipsByUserIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchFriendshipsByUserIDs,
		loader.createFriendshipsByUserIDMap,
		base.ParseUintKey,
	)

	// RequestsByUserID用のローダー
	loader.requestsByUserIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchRequestsByUserIDs,
		loader.createRequestsUserIDMap,
		base.ParseUintKey,
	)

	// RecommendedByUserID用のローダー
	loader.recommendedByUserIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchRecommendedByUserIDs,
		loader.createRecommendedUserIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByID は指定されたFriendshipIDのFriendshipを取得
func (l *FriendshipDataLoader) LoadByID(ctx context.Context, friendshipID string) (*entity.Friendship, error) {
	return l.byIDLoader.Load(ctx, friendshipID)
}

// LoadFriendsByUserID は指定されたUserIDの友達を取得
func (l *FriendshipDataLoader) LoadFriendsByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	friendships, err := l.friendshipsByUserIDLoader.Load(ctx, userID)
	if err != nil {
		return nil, err
	}

	result := make([]*entity.User, 0, len(friendships))
	userIDUint, _ := base.ParseUintKey(userID)

	for _, friendship := range friendships {
		if friendship.RequesterID == userIDUint && friendship.Requestee.ID != 0 {
			result = append(result, &friendship.Requestee)
		} else if friendship.RequesteeID == userIDUint && friendship.Requester.ID != 0 {
			result = append(result, &friendship.Requester)
		}
	}

	return result, nil
}

// LoadRequestsByUserID は指定されたUserIDの友達リクエストを取得
func (l *FriendshipDataLoader) LoadRequestsByUserID(ctx context.Context, userID string) ([]*entity.Friendship, error) {
	return l.requestsByUserIDLoader.Load(ctx, userID)
}

// LoadRecommendedByUserID は指定されたUserIDの推奨ユーザーを取得
func (l *FriendshipDataLoader) LoadRecommendedByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	return l.recommendedByUserIDLoader.Load(ctx, userID)
}

// fetchByIDs はRepository経由でFriendshipID別にデータを取得
func (l *FriendshipDataLoader) fetchByIDs(friendshipIDs []uint) ([]*entity.Friendship, error) {
	return l.repository.GetFriendshipsByIDs(friendshipIDs)
}

// fetchFriendshipsByUserIDs はRepository経由でUserID別に友達関係データを取得
func (l *FriendshipDataLoader) fetchFriendshipsByUserIDs(userIDs []uint) ([]*entity.Friendship, error) {
	return l.repository.GetFriendshipsByUserIDs(userIDs)
}

// fetchRequestsByUserIDs はRepository経由でUserID別に友達リクエストデータを取得
func (l *FriendshipDataLoader) fetchRequestsByUserIDs(userIDs []uint) ([]*entity.Friendship, error) {
	return l.repository.GetFriendshipRequestsByUserIDs(userIDs)
}

// fetchRecommendedByUserIDs はRepository経由でUserID別に推奨ユーザーデータを取得
func (l *FriendshipDataLoader) fetchRecommendedByUserIDs(userIDs []uint) ([]*entity.User, error) {
	return l.repository.GetRecommendedUsersByUserIDs(userIDs)
}

// createIDMap はFriendshipID別にデータをマップ化
func (l *FriendshipDataLoader) createIDMap(friendships []*entity.Friendship) map[uint]*entity.Friendship {
	result := make(map[uint]*entity.Friendship)
	for _, friendship := range friendships {
		if friendship != nil {
			result[friendship.ID] = friendship
		}
	}
	return result
}

// createFriendshipsByUserIDMap は友達関係データをUserID別にマップ化
func (l *FriendshipDataLoader) createFriendshipsByUserIDMap(friendships []*entity.Friendship) map[uint][]*entity.Friendship {
	result := make(map[uint][]*entity.Friendship)

	for _, friendship := range friendships {
		if friendship != nil {
			// 友達関係の両方のユーザーに対してマッピング
			result[friendship.RequesterID] = append(result[friendship.RequesterID], friendship)
			result[friendship.RequesteeID] = append(result[friendship.RequesteeID], friendship)
		}
	}

	return result
}

// createRequestsUserIDMap はUserID別に友達リクエストデータをマップ化
func (l *FriendshipDataLoader) createRequestsUserIDMap(friendships []*entity.Friendship) map[uint][]*entity.Friendship {
	result := make(map[uint][]*entity.Friendship)
	for _, friendship := range friendships {
		if friendship != nil {
			result[friendship.RequesteeID] = append(result[friendship.RequesteeID], friendship)
		}
	}
	return result
}

// createRecommendedUserIDMap はUserID別に推奨ユーザーデータをマップ化
func (l *FriendshipDataLoader) createRecommendedUserIDMap(users []*entity.User) map[uint][]*entity.User {
	result := make(map[uint][]*entity.User)

	// 注意: 現在のRepository実装では全ユーザーに対して同じ推奨リストを返すため、
	// 適切なDataLoaderマッピングができない。各ユーザー固有の推奨ロジックが必要。

	return result
}
