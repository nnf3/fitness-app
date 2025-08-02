package profile

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"app/graph/services/common"
	"context"
	"fmt"
	"time"
)

type ProfileService interface {
	GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error)
	CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error)
	UpdateProfile(ctx context.Context, input model.UpdateProfile) (*model.Profile, error)
}

type profileService struct {
	repo      ProfileRepository
	converter *ProfileConverter
	loader    dataloader.ProfileLoaderInterface
	common    common.CommonRepository
}

func NewProfileService(repo ProfileRepository, converter *ProfileConverter, loader dataloader.ProfileLoaderInterface) ProfileService {
	return &profileService{
		repo:      repo,
		converter: converter,
		loader:    loader,
		common:    common.NewCommonRepository(repo.(*profileRepository).db),
	}
}

func (s *profileService) GetProfileByUserID(ctx context.Context, userID string) (*model.Profile, error) {
	profile, err := s.loader.LoadProfile(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to load profile: %w", err)
	}

	if profile == nil {
		return nil, nil
	}

	return s.converter.ToModelProfile(*profile), nil
}

func (s *profileService) CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	birthDate, err := time.Parse(common.DateFormat, input.BirthDate)
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

	if err := s.repo.CreateProfile(ctx, &profile); err != nil {
		return nil, fmt.Errorf("failed to create profile: %w", err)
	}

	return s.converter.ToModelProfile(profile), nil
}

func (s *profileService) UpdateProfile(ctx context.Context, input model.UpdateProfile) (*model.Profile, error) {
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	// 既存のプロフィールを取得
	existingProfile, err := s.repo.GetProfileByUserID(ctx, fmt.Sprintf("%d", currentUser.ID))
	if err != nil {
		return nil, fmt.Errorf("failed to get existing profile: %w", err)
	}

	if existingProfile == nil {
		return nil, fmt.Errorf("profile not found")
	}

	// 更新可能なフィールドのみ更新
	if input.Name != nil {
		existingProfile.Name = *input.Name
	}

	if input.BirthDate != nil {
		birthDate, err := time.Parse(common.DateFormat, *input.BirthDate)
		if err != nil {
			return nil, fmt.Errorf("failed to parse birth date: %w", err)
		}
		existingProfile.BirthDate = &birthDate
	}

	if input.Gender != nil {
		existingProfile.GenderFromGraphQL(input.Gender)
	}

	if input.Height != nil {
		existingProfile.Height = input.Height
	}

	if input.Weight != nil {
		existingProfile.Weight = input.Weight
	}

	if input.ActivityLevel != nil {
		existingProfile.ActivityLevelFromGraphQL(input.ActivityLevel)
	}

	if input.ImageURL != nil {
		existingProfile.ImageURL = *input.ImageURL
	}

	if err := s.repo.UpdateProfile(ctx, existingProfile); err != nil {
		return nil, fmt.Errorf("failed to update profile: %w", err)
	}

	return s.converter.ToModelProfile(*existingProfile), nil
}
