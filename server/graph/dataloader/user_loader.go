package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type UserLoaderInterface interface {
	LoadUser(ctx context.Context, userID string) (*entity.User, error)
	LoadUsers(ctx context.Context, userIDs []string) ([]*entity.User, []error)
}

type UserLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, *entity.User]
}

func NewUserLoader(db *gorm.DB) UserLoaderInterface {
	userLoader := &UserLoader{db: db}
	userLoader.loader = dataloader.NewBatchedLoader(userLoader.batchLoad)
	return userLoader
}

func (l *UserLoader) fetchUsersFromDB(userIDs []uint) ([]entity.User, error) {
	var users []entity.User
	err := l.db.Where("id IN ?", userIDs).Find(&users).Error
	return users, err
}

func (l *UserLoader) createResults(keyStrings []string, users []entity.User) []*dataloader.Result[*entity.User] {
	userMap := make(map[uint]*entity.User)
	for i := range users {
		userMap[users[i].ID] = &users[i]
	}

	return CreateResultsFromMap(keyStrings, userMap, func(key string) (uint, error) {
		if id, err := strconv.ParseUint(key, 10, 32); err == nil {
			return uint(id), nil
		}
		return 0, fmt.Errorf("invalid user ID: %s", key)
	})
}

func (l *UserLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[*entity.User] {
	keyStrings := convertKeysToStrings(keys)

	userIDs, parseErrors := parseUserIDs(keyStrings)
	if len(parseErrors) > 0 {
		return CreateErrorResults[*entity.User](keyStrings, fmt.Errorf("failed to parse user IDs"))
	}

	users, err := l.fetchUsersFromDB(userIDs)
	if err != nil {
		return CreateErrorResults[*entity.User](keyStrings, fmt.Errorf("failed to load users: %w", err))
	}

	return l.createResults(keyStrings, users)
}

func (l *UserLoader) LoadUser(ctx context.Context, userID string) (*entity.User, error) {
	return LoadGeneric(ctx, l.loader, StringKey(userID))
}

func (l *UserLoader) LoadUsers(ctx context.Context, userIDs []string) ([]*entity.User, []error) {
	keys := ConvertToStringKeys(userIDs)
	return LoadManyGeneric(ctx, l.loader, keys)
}
