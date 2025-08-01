package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

type ProfileLoaderInterface interface {
	LoadProfile(ctx context.Context, userID string) (*entity.Profile, error)
	LoadProfiles(ctx context.Context, userIDs []string) ([]*entity.Profile, []error)
}

type ProfileLoader struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, *entity.Profile]
}

func NewProfileLoader(db *gorm.DB) ProfileLoaderInterface {
	profileLoader := &ProfileLoader{db: db}
	profileLoader.loader = dataloader.NewBatchedLoader(profileLoader.batchLoad)
	return profileLoader
}

func parseUserIDs(keyStrings []string) ([]uint, []error) {
	baseLoader := &BaseLoader{}
	return baseLoader.ParseUintKeys(keyStrings)
}

func (l *ProfileLoader) fetchProfilesFromDB(userIDs []uint) ([]entity.Profile, error) {
	var profiles []entity.Profile
	err := l.db.Where("user_id IN ?", userIDs).Find(&profiles).Error
	return profiles, err
}

func (l *ProfileLoader) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[*entity.Profile] {
	keyStrings := convertKeysToStrings(keys)

	userIDs, parseErrors := parseUserIDs(keyStrings)
	if len(parseErrors) > 0 {
		return CreateErrorResults[*entity.Profile](keyStrings, fmt.Errorf("failed to parse user IDs"))
	}

	profiles, err := l.fetchProfilesFromDB(userIDs)
	if err != nil {
		return CreateErrorResults[*entity.Profile](keyStrings, fmt.Errorf("failed to load profiles: %w", err))
	}

	return l.createResults(keyStrings, profiles)
}

func (l *ProfileLoader) createResults(keyStrings []string, profiles []entity.Profile) []*dataloader.Result[*entity.Profile] {
	profileMap := make(map[uint]*entity.Profile)
	for i := range profiles {
		profileMap[profiles[i].UserID] = &profiles[i]
	}

	return CreateResultsFromMap(keyStrings, profileMap, func(key string) (uint, error) {
		if id, err := strconv.ParseUint(key, 10, 32); err == nil {
			return uint(id), nil
		}
		return 0, fmt.Errorf("invalid user ID: %s", key)
	})
}

// ユーザーIDでプロファイルをロード
func (p *ProfileLoader) LoadProfile(ctx context.Context, userID string) (*entity.Profile, error) {
	return LoadGeneric(ctx, p.loader, StringKey(userID))
}

// LoadManyを使用してユーザーIDで複数のプロファイルをロード
func (p *ProfileLoader) LoadProfiles(ctx context.Context, userIDs []string) ([]*entity.Profile, []error) {
	keys := ConvertToStringKeys(userIDs)
	return LoadManyGeneric(ctx, p.loader, keys)
}
