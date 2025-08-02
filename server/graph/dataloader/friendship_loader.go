package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type FriendshipLoaderInterface interface {
	LoadFriendships(ctx context.Context, userID string) ([]*entity.Friendship, error)
	LoadFriendshipsByUserID(ctx context.Context, userID string) ([]*entity.Friendship, error)
}

type FriendshipLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, []*entity.Friendship]
}

func NewFriendshipLoader(db *gorm.DB) FriendshipLoaderInterface {
	loader := &FriendshipLoader{db: db}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

func (l *FriendshipLoader) fetchFriendshipsFromDB(userIDs []uint) ([]entity.Friendship, error) {
	var friendships []entity.Friendship
	err := l.db.
		Preload("Requester").
		Preload("Requestee").
		Where("requester_id IN ? OR requestee_id IN ?", userIDs, userIDs).
		Find(&friendships).Error
	return friendships, err
}

func (l *FriendshipLoader) createResults(keyStrings []string, friendships []entity.Friendship) []*dataloader.Result[[]*entity.Friendship] {
	friendshipMap := make(map[uint][]*entity.Friendship)

	for i := range friendships {
		// 申請者と被申請者の両方のユーザーIDに対してマッピング
		requesterID := friendships[i].RequesterID
		requesteeID := friendships[i].RequesteeID

		friendshipMap[requesterID] = append(friendshipMap[requesterID], &friendships[i])
		friendshipMap[requesteeID] = append(friendshipMap[requesteeID], &friendships[i])
	}

	return CreateResultsFromMapArray[entity.Friendship](keyStrings, friendshipMap, func(key string) (uint, error) {
		if id, err := strconv.ParseUint(key, 10, 32); err == nil {
			return uint(id), nil
		}
		return 0, fmt.Errorf("invalid user ID: %s", key)
	})
}

func (l *FriendshipLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*entity.Friendship] {
	userIDs, errs := (&BaseLoader{}).ParseUintKeys(convertKeysToStrings(keys))
	if len(errs) > 0 {
		return CreateErrorResults[[]*entity.Friendship](convertKeysToStrings(keys), fmt.Errorf("invalid user IDs"))
	}

	friendships, err := l.fetchFriendshipsFromDB(userIDs)
	if err != nil {
		return CreateErrorResults[[]*entity.Friendship](convertKeysToStrings(keys), err)
	}

	return l.createResults(convertKeysToStrings(keys), friendships)
}

func (l *FriendshipLoader) LoadFriendships(ctx context.Context, userID string) ([]*entity.Friendship, error) {
	return LoadGeneric(ctx, l.loader, StringKey(userID))
}

func (l *FriendshipLoader) LoadFriendshipsByUserID(ctx context.Context, userID string) ([]*entity.Friendship, error) {
	return LoadGeneric(ctx, l.loader, StringKey(userID))
}
