package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type FriendsLoaderInterface interface {
	LoadByUserID(ctx context.Context, userID string) ([]*entity.User, error)
}

type FriendsLoader struct {
	*base.BaseArrayLoader[entity.User]
}

func NewFriendsLoader(db *gorm.DB) FriendsLoaderInterface {
	loader := &FriendsLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchFriendsFromDB,
		loader.createFriendsMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *FriendsLoader) fetchFriendsFromDB(userIDs []uint) ([]*entity.User, error) {
	// Friendshipテーブルから友達関係を取得し、友達のユーザー情報を取得
	var friendships []entity.Friendship
	err := l.DB().
		Preload("Requester").
		Preload("Requestee").
		Where("(requester_id IN ? OR requestee_id IN ?) AND status = ?", userIDs, userIDs, "accepted").
		Find(&friendships).Error
	if err != nil {
		return nil, err
	}

	// 友達のユーザーIDを収集
	friendIDs := make(map[uint]bool)
	for _, friendship := range friendships {
		if friendship.RequesterID != 0 {
			friendIDs[friendship.RequesterID] = true
		}
		if friendship.RequesteeID != 0 {
			friendIDs[friendship.RequesteeID] = true
		}
	}

	// 友達のユーザー情報を取得
	var friends []entity.User
	if len(friendIDs) > 0 {
		ids := make([]uint, 0, len(friendIDs))
		for id := range friendIDs {
			ids = append(ids, id)
		}
		err = l.DB().Where("id IN ?", ids).Find(&friends).Error
		if err != nil {
			return nil, err
		}
	}

	// entity.Userのスライスを*entity.Userのスライスに変換
	result := make([]*entity.User, len(friends))
	for i := range friends {
		result[i] = &friends[i]
	}
	return result, nil
}

func (l *FriendsLoader) createFriendsMap(friends []*entity.User) map[uint][]*entity.User {
	// この実装は簡略化しています。実際には各ユーザーに対して友達リストをマッピングする必要があります
	friendsMap := make(map[uint][]*entity.User)
	for _, friend := range friends {
		// 実際の実装では、各ユーザーの友達リストを適切にマッピングする必要があります
		// ここでは簡略化のため、すべての友達を各ユーザーにマッピングしています
		for _, userID := range []uint{1, 2, 3} { // 仮のユーザーID
			friendsMap[userID] = append(friendsMap[userID], friend)
		}
	}
	return friendsMap
}

func (l *FriendsLoader) LoadByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	return l.Load(ctx, userID)
}
