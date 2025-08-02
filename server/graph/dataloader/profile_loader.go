package dataloader

import (
	"app/entity"
	"app/graph/dataloader/base"
	"context"

	"gorm.io/gorm"
)

type ProfileLoaderInterface interface {
	LoadProfile(ctx context.Context, userID string) (*entity.Profile, error)
}

type ProfileLoader struct {
	*base.BaseLoader[*entity.Profile]
}

func NewProfileLoader(db *gorm.DB) ProfileLoaderInterface {
	loader := &ProfileLoader{}
	loader.BaseLoader = base.NewBaseLoader(
		db,
		loader.fetchProfilesFromDB,
		loader.createProfileMap,
		base.ParseUintKey,
	)
	return loader
}

func (l *ProfileLoader) fetchProfilesFromDB(userIDs []uint) ([]*entity.Profile, error) {
	var profiles []entity.Profile
	err := l.DB().Where("user_id IN ?", userIDs).Find(&profiles).Error
	if err != nil {
		return nil, err
	}

	// entity.Profileのスライスを*entity.Profileのスライスに変換
	result := make([]*entity.Profile, len(profiles))
	for i := range profiles {
		result[i] = &profiles[i]
	}
	return result, nil
}

func (l *ProfileLoader) createProfileMap(profiles []*entity.Profile) map[uint]*entity.Profile {
	profileMap := make(map[uint]*entity.Profile)
	for _, profile := range profiles {
		profileMap[profile.UserID] = profile
	}
	return profileMap
}

// ユーザーIDでプロファイルをロード
func (l *ProfileLoader) LoadProfile(ctx context.Context, userID string) (*entity.Profile, error) {
	return l.Load(ctx, userID)
}
