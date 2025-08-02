package services

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"context"
	"fmt"
	"time"

	"gorm.io/gorm"
)

const (
	DateFormat = "2006-01-02"
	TimeFormat = time.RFC3339
)

type ProfileService interface {
	GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error)
	CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error)
	UpdateProfile(ctx context.Context, input model.UpdateProfile) (*model.Profile, error)
}

type profileService struct {
	db            *gorm.DB
	profileLoader dataloader.ProfileLoaderInterface
}

func NewProfileService(db *gorm.DB, profileLoader dataloader.ProfileLoaderInterface) ProfileService {
	return &profileService{
		db:            db,
		profileLoader: profileLoader,
	}
}

func convertProfile(profile entity.Profile) *model.Profile {
	formatDate := func(t *time.Time) *string {
		if t == nil {
			return nil
		}
		formatted := t.Format(DateFormat)
		return &formatted
	}

	formatString := func(s string) *string {
		if s == "" {
			return nil
		}
		return &s
	}

	return &model.Profile{
		ID:            fmt.Sprintf("%d", profile.ID),
		Name:          profile.Name,
		BirthDate:     formatDate(profile.BirthDate),
		Gender:        profile.GenderToGraphQL(),
		Height:        profile.Height,
		Weight:        profile.Weight,
		ActivityLevel: profile.ActivityLevelToGraphQL(),
		ImageURL:      formatString(profile.ImageURL),
		CreatedAt:     profile.CreatedAt.Format(TimeFormat),
		UpdatedAt:     profile.UpdatedAt.Format(TimeFormat),
	}
}

func (p *profileService) GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error) {
	profile, err := p.profileLoader.LoadProfile(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to load profile: %w", err)
	}

	if profile == nil {
		return nil, nil
	}

	return convertProfile(*profile), nil
}

func (p *profileService) CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error) {
	currentUser, err := NewUserService(p.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	birthDate, err := time.Parse(DateFormat, input.BirthDate)
	if err != nil {
		return nil, fmt.Errorf("failed to parse birth date: %w", err)
	}

	profile := entity.Profile{
		UserID:    currentUser.ID,
		Name:      input.Name,
		BirthDate: &birthDate,
	}

	// enum型の変換
	profile.GenderFromGraphQL(&input.Gender)

	if input.Height != nil {
		profile.Height = input.Height
	}
	if input.Weight != nil {
		profile.Weight = input.Weight
	}
	if input.ActivityLevel != nil {
		profile.ActivityLevelFromGraphQL(input.ActivityLevel)
	}
	if input.ImageURL != nil {
		profile.ImageURL = *input.ImageURL
	}

	if err := p.db.Create(&profile).Error; err != nil {
		return nil, fmt.Errorf("failed to create profile: %w", err)
	}

	return convertProfile(profile), nil
}

func (p *profileService) UpdateProfile(ctx context.Context, input model.UpdateProfile) (*model.Profile, error) {
	currentUser, err := NewUserService(p.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	var profile entity.Profile
	if err := p.db.Where("user_id = ?", currentUser.ID).First(&profile).Error; err != nil {
		profile = entity.Profile{
			UserID: currentUser.ID,
		}
	}

	if input.Name != nil {
		profile.Name = *input.Name
	}
	if input.BirthDate != nil {
		birthDate, err := time.Parse(DateFormat, *input.BirthDate)
		if err != nil {
			return nil, fmt.Errorf("failed to parse birth date: %w", err)
		}
		profile.BirthDate = &birthDate
	}
	if input.Gender != nil {
		profile.GenderFromGraphQL(input.Gender)
	}
	if input.Height != nil {
		profile.Height = input.Height
	}
	if input.Weight != nil {
		profile.Weight = input.Weight
	}
	if input.ActivityLevel != nil {
		profile.ActivityLevelFromGraphQL(input.ActivityLevel)
	}
	if input.ImageURL != nil {
		profile.ImageURL = *input.ImageURL
	}

	if err := p.db.Save(&profile).Error; err != nil {
		return nil, fmt.Errorf("failed to update profile: %w", err)
	}

	return convertProfile(profile), nil
}
