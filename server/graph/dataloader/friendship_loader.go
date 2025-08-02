package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type FriendshipLoaderInterface interface {
	LoadFriendships(ctx context.Context, userID string) ([]*entity.Friendship, error)
}

type FriendshipLoader struct {
	*base.BaseArrayLoader[entity.Friendship]
}

func NewFriendshipLoader(db *gorm.DB) FriendshipLoaderInterface {
	loader := &FriendshipLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchFriendshipsFromDB,
		loader.createFriendshipMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *FriendshipLoader) fetchFriendshipsFromDB(userIDs []uint) ([]*entity.Friendship, error) {
	var friendships []entity.Friendship
	err := l.DB().
		Preload("Requester").
		Preload("Requestee").
		Where("requester_id IN ? OR requestee_id IN ?", userIDs, userIDs).
		Find(&friendships).Error
	if err != nil {
		return nil, err
	}

	// entity.Friendshipのスライスを*entity.Friendshipのスライスに変換
	result := make([]*entity.Friendship, len(friendships))
	for i := range friendships {
		result[i] = &friendships[i]
	}
	return result, nil
}

func (l *FriendshipLoader) createFriendshipMap(friendships []*entity.Friendship) map[uint][]*entity.Friendship {
	friendshipMap := make(map[uint][]*entity.Friendship)

	for _, friendship := range friendships {
		// 申請者と被申請者の両方のユーザーIDに対してマッピング
		requesterID := friendship.RequesterID
		requesteeID := friendship.RequesteeID

		friendshipMap[requesterID] = append(friendshipMap[requesterID], friendship)
		friendshipMap[requesteeID] = append(friendshipMap[requesteeID], friendship)
	}

	return friendshipMap
}

// ユーザーIDでFriendshipをロード
func (l *FriendshipLoader) LoadFriendships(ctx context.Context, userID string) ([]*entity.Friendship, error) {
	return l.Load(ctx, userID)
}
