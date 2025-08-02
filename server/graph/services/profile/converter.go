package profile

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"fmt"
	"time"
)

type ProfileConverter struct{}

func NewProfileConverter() *ProfileConverter {
	return &ProfileConverter{}
}

func (c *ProfileConverter) ToModelProfile(profile entity.Profile) *model.Profile {
	formatDate := func(t *time.Time) *string {
		if t == nil {
			return nil
		}
		formatted := t.Format(common.DateFormat)
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
		CreatedAt:     profile.CreatedAt.Format(common.TimeFormat),
		UpdatedAt:     profile.UpdatedAt.Format(common.TimeFormat),
	}
}

func (c *ProfileConverter) ToModelProfiles(profiles []entity.Profile) []*model.Profile {
	result := make([]*model.Profile, len(profiles))
	for i, profile := range profiles {
		result[i] = c.ToModelProfile(profile)
	}
	return result
}

func (c *ProfileConverter) ToModelProfilesFromPointers(profiles []*entity.Profile) []*model.Profile {
	result := make([]*model.Profile, len(profiles))
	for i, profile := range profiles {
		if profile != nil {
			result[i] = c.ToModelProfile(*profile)
		}
	}
	return result
}
