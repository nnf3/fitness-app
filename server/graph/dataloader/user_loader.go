package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type UserLoaderInterface interface {
	LoadUser(ctx context.Context, userID string) (*entity.User, error)
}

type UserLoader struct {
	*base.BaseLoader[*entity.User]
}

func NewUserLoader(db *gorm.DB) UserLoaderInterface {
	loader := &UserLoader{}
	loader.BaseLoader = base.NewBaseLoader(
		db,
		loader.fetchUsersFromDB,
		loader.createUserMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *UserLoader) fetchUsersFromDB(userIDs []uint) ([]*entity.User, error) {
	var users []entity.User
	err := l.DB().Where("id IN ?", userIDs).Find(&users).Error
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

func (l *UserLoader) createUserMap(users []*entity.User) map[uint]*entity.User {
	userMap := make(map[uint]*entity.User)
	for _, user := range users {
		userMap[user.ID] = user
	}
	return userMap
}

// ユーザーIDでユーザーをロード
func (l *UserLoader) LoadUser(ctx context.Context, userID string) (*entity.User, error) {
	return l.Load(ctx, userID)
}
