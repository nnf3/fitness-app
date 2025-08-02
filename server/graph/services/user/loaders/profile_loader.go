package loaders

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"

	"gorm.io/gorm"
)

type ProfileLoaderInterface interface {
	LoadByUserID(ctx context.Context, userID string) (*entity.Profile, error)
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
	if err := l.DB().Where("user_id IN ?", userIDs).Find(&profiles).Error; err != nil {
		return nil, err
	}

	result := make([]*entity.Profile, len(profiles))
	for i, profile := range profiles {
		result[i] = &profile
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

func (l *ProfileLoader) LoadByUserID(ctx context.Context, userID string) (*entity.Profile, error) {
	return l.Load(ctx, userID)
}
