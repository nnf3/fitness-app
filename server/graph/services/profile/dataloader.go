package profile

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// ProfileDataLoader は Profile エンティティの遅延ローディングを担当
type ProfileDataLoader struct {
	repository     ProfileRepository
	byUserIDLoader *base.BaseLoader[*entity.Profile]
}

// NewProfileDataLoader は新しいDataLoaderを作成
func NewProfileDataLoader(repository ProfileRepository) *ProfileDataLoader {
	loader := &ProfileDataLoader{
		repository: repository,
	}

	// ByUserID用のローダー
	loader.byUserIDLoader = base.NewBaseLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByUserIDs,
		loader.createUserIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByUserID は指定されたUserIDのProfileを取得
func (l *ProfileDataLoader) LoadByUserID(ctx context.Context, userID string) (*entity.Profile, error) {
	return l.byUserIDLoader.Load(ctx, userID)
}

// fetchByUserIDs はRepository経由でUserID別にデータを取得
func (l *ProfileDataLoader) fetchByUserIDs(userIDs []uint) ([]*entity.Profile, error) {
	return l.repository.GetProfilesByUserIDs(userIDs)
}

// createUserIDMap はUserID別にデータをマップ化
func (l *ProfileDataLoader) createUserIDMap(profiles []*entity.Profile) map[uint]*entity.Profile {
	result := make(map[uint]*entity.Profile)
	for _, profile := range profiles {
		if profile != nil {
			result[profile.UserID] = profile
		}
	}
	return result
}
