package user

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// UserDataLoader は User エンティティの遅延ローディングを担当
type UserDataLoader struct {
	repository UserRepository
	byIDLoader *base.BaseLoader[*entity.User]
}

// NewUserDataLoader は新しいDataLoaderを作成
func NewUserDataLoader(repository UserRepository) *UserDataLoader {
	loader := &UserDataLoader{
		repository: repository,
	}

	// ByID用のローダー
	loader.byIDLoader = base.NewBaseLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByIDs,
		loader.createIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByID は指定されたUserIDのUserを取得
func (l *UserDataLoader) LoadByID(ctx context.Context, userID string) (*entity.User, error) {
	return l.byIDLoader.Load(ctx, userID)
}

// fetchByIDs はRepository経由でUserID別にデータを取得
func (l *UserDataLoader) fetchByIDs(userIDs []uint) ([]*entity.User, error) {
	return l.repository.GetUsersByIDs(userIDs)
}

// createIDMap はUserID別にデータをマップ化
func (l *UserDataLoader) createIDMap(users []*entity.User) map[uint]*entity.User {
	result := make(map[uint]*entity.User)
	for _, user := range users {
		if user != nil {
			result[user.ID] = user
		}
	}
	return result
}
