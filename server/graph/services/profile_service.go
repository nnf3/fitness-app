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

type ProfileService interface {
	GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error)
	GetProfileByUserIDWithFallback(ctx context.Context, userID string) (*model.Profile, error)
	CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error)
}

type profileService struct {
	db *gorm.DB
}

func NewProfileService(db *gorm.DB) ProfileService {
	return &profileService{db: db}
}

func convertProfile(profile entity.Profile) *model.Profile {
	var birthDate *string
	if profile.BirthDate != nil {
		formatted := profile.BirthDate.Format("2006-01-02")
		birthDate = &formatted
	}

	var gender *string
	if profile.Gender != "" {
		gender = &profile.Gender
	}

	var activityLevel *string
	if profile.ActivityLevel != "" {
		activityLevel = &profile.ActivityLevel
	}

	return &model.Profile{
		ID:            fmt.Sprintf("%d", profile.ID),
		Name:          profile.Name,
		BirthDate:     birthDate,
		Gender:        gender,
		Height:        profile.Height,
		Weight:        profile.Weight,
		ActivityLevel: activityLevel,
		CreatedAt:     profile.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     profile.UpdatedAt.Format(time.RFC3339),
	}
}

func (p *profileService) GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error) {
	loader := dataloader.GetProfileLoader(ctx)
	if loader == nil {
		return nil, fmt.Errorf("profile loader not available")
	}

	profile, err := dataloader.LoadProfile(ctx, loader, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to load profile: %w", err)
	}

	if profile == nil {
		return nil, nil
	}

	return convertProfile(*profile), nil
}

func (p *profileService) GetProfileByUserIDWithFallback(ctx context.Context, userID string) (*model.Profile, error) {
	// Try DataLoader first
	loader := dataloader.GetProfileLoader(ctx)
	if loader != nil {
		profile, err := dataloader.LoadProfile(ctx, loader, userID)
		if err != nil {
			return nil, fmt.Errorf("failed to load profile: %w", err)
		}

		if profile == nil {
			return nil, nil
		}

		return convertProfile(*profile), nil
	}

	// Fallback to direct database query
	var profile entity.Profile
	if err := p.db.Where("user_id = ?", userID).First(&profile).Error; err != nil {
		// Profile doesn't exist, return nil
		return nil, nil
	}

	return convertProfile(profile), nil
}

func (p *profileService) CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error) {
	currentUser, err := NewUserService(p.db).GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	// Parse birth date in "YYYY-MM-DD" format
	birthDate, err := time.Parse("2006-01-02", input.BirthDate)
	if err != nil {
		return nil, fmt.Errorf("failed to parse birth date: %w", err)
	}

	profile := entity.Profile{
		UserID:    currentUser.ID,
		Name:      input.Name,
		BirthDate: &birthDate,
		Gender:    input.Gender,
		Height:    &input.Height,
		Weight:    &input.Weight,
	}

	if err := p.db.Create(&profile).Error; err != nil {
		return nil, fmt.Errorf("failed to create profile: %w", err)
	}

	return convertProfile(profile), nil
}
