package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type RecommendedUsersLoaderInterface interface {
	LoadByUserID(ctx context.Context, userID string) ([]*entity.User, error)
}

type RecommendedUsersLoader struct {
	*base.BaseArrayLoader[entity.User]
}

func NewRecommendedUsersLoader(db *gorm.DB) RecommendedUsersLoaderInterface {
	loader := &RecommendedUsersLoader{}
	loader.BaseArrayLoader = base.NewBaseArrayLoader(
		db,
		loader.fetchRecommendedUsersFromDB,
		loader.createRecommendedUsersMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *RecommendedUsersLoader) fetchRecommendedUsersFromDB(userIDs []uint) ([]*entity.User, error) {
	var users []entity.User
	err := l.DB().
		Preload("Profile").
		Find(&users, userIDs).Error
	if err != nil {
		return nil, err
	}

	// entity.Userのスライスを*entity.Userのスライスに変換
	result := make([]*entity.User, len(users))
	for i := range users {
		result[i] = &users[i]
	}
	return result, nil
}

func (l *RecommendedUsersLoader) createRecommendedUsersMap(users []*entity.User) map[uint][]*entity.User {
	userMap := make(map[uint][]*entity.User)
	for _, user := range users {
		// ここでは推奨ユーザーのロジックを実装
		// 現在は単純にユーザーIDでマッピング
		userMap[user.ID] = append(userMap[user.ID], user)
	}
	return userMap
}

func (l *RecommendedUsersLoader) LoadByUserID(ctx context.Context, userID string) ([]*entity.User, error) {
	return l.Load(ctx, userID)
}
