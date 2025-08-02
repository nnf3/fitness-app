package profile

import (
	"app/entity"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type ProfileRepository interface {
	GetProfileByUserID(ctx context.Context, userID string) (*entity.Profile, error)
	CreateProfile(ctx context.Context, profile *entity.Profile) error
	UpdateProfile(ctx context.Context, profile *entity.Profile) error
}

type profileRepository struct {
	db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) ProfileRepository {
	return &profileRepository{db: db}
}

func (r *profileRepository) GetProfileByUserID(ctx context.Context, userID string) (*entity.Profile, error) {
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %s", userID)
	}

	var profile entity.Profile
	if err := r.db.Where("user_id = ?", uint(id)).First(&profile).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch profile: %w", err)
	}

	return &profile, nil
}

func (r *profileRepository) CreateProfile(ctx context.Context, profile *entity.Profile) error {
	return r.db.Create(profile).Error
}

func (r *profileRepository) UpdateProfile(ctx context.Context, profile *entity.Profile) error {
	return r.db.Save(profile).Error
}
