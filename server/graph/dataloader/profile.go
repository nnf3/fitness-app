package dataloader

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

// ProfileLoaderKey is the key type for profile loader
type ProfileLoaderKey string

// String returns the string representation of the key
func (k ProfileLoaderKey) String() string {
	return string(k)
}

// Raw returns the raw string value
func (k ProfileLoaderKey) Raw() interface{} {
	return string(k)
}

// ProfileLoader loads profiles by user IDs
type ProfileLoader struct {
	db *gorm.DB
}

// NewProfileLoader creates a new profile loader
func NewProfileLoader(db *gorm.DB) *dataloader.Loader[ProfileLoaderKey, *entity.Profile] {
	loader := &ProfileLoader{db: db}
	return dataloader.NewBatchedLoader(loader.batchLoad)
}

// batchLoad loads multiple profiles by user IDs
func (l *ProfileLoader) batchLoad(ctx context.Context, keys []ProfileLoaderKey) []*dataloader.Result[*entity.Profile] {
	// Convert keys to user IDs
	var userIDs []uint
	for _, key := range keys {
		if userID, err := strconv.ParseUint(string(key), 10, 32); err == nil {
			userIDs = append(userIDs, uint(userID))
		}
	}

	// Fetch profiles from database
	var profiles []entity.Profile
	if err := l.db.Where("user_id IN ?", userIDs).Find(&profiles).Error; err != nil {
		// Return errors for all keys
		results := make([]*dataloader.Result[*entity.Profile], len(keys))
		for i := range results {
			results[i] = &dataloader.Result[*entity.Profile]{
				Error: fmt.Errorf("failed to load profiles: %w", err),
			}
		}
		return results
	}

	// Create a map for quick lookup
	profileMap := make(map[uint]*entity.Profile)
	for i := range profiles {
		profileMap[profiles[i].UserID] = &profiles[i]
	}

	// Return results in the same order as keys
	results := make([]*dataloader.Result[*entity.Profile], len(keys))
	for i, key := range keys {
		if userID, err := strconv.ParseUint(string(key), 10, 32); err == nil {
			if profile, exists := profileMap[uint(userID)]; exists {
				results[i] = &dataloader.Result[*entity.Profile]{
					Data: profile,
				}
			} else {
				// Profile doesn't exist, return nil
				results[i] = &dataloader.Result[*entity.Profile]{
					Data: nil,
				}
			}
		} else {
			results[i] = &dataloader.Result[*entity.Profile]{
				Error: fmt.Errorf("invalid user ID: %s", string(key)),
			}
		}
	}

	return results
}

// LoadProfile loads a profile by user ID
func LoadProfile(ctx context.Context, loader *dataloader.Loader[ProfileLoaderKey, *entity.Profile], userID string) (*entity.Profile, error) {
	thunk := loader.Load(ctx, ProfileLoaderKey(userID))
	result, err := thunk()
	if err != nil {
		return nil, err
	}
	return result, nil
}
