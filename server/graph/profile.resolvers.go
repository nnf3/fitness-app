package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Mutation
// ================================

// CreateProfile is the resolver for the createProfile field.
func (r *mutationResolver) CreateProfile(ctx context.Context, input model.CreateProfile) (*model.Profile, error) {
	profileService := services.NewProfileServiceWithSeparation(r.DB, r.DataLoaders.ProfileLoaderForUser)
	return profileService.CreateProfile(ctx, input)
}

// UpdateProfile is the resolver for the updateProfile field.
func (r *mutationResolver) UpdateProfile(ctx context.Context, input model.UpdateProfile) (*model.Profile, error) {
	profileService := services.NewProfileServiceWithSeparation(r.DB, r.DataLoaders.ProfileLoaderForUser)
	return profileService.UpdateProfile(ctx, input)
}
