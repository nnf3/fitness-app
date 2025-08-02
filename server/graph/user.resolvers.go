package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
	"fmt"
)

// ================================
// Model
// ================================

// User returns UserResolver implementation.
func (r *Resolver) User() UserResolver { return &userResolver{r} }

type userResolver struct{ *Resolver }

// Profile is the resolver for the profile field.
func (r *userResolver) Profile(ctx context.Context, obj *model.User) (*model.Profile, error) {
	profileService := services.NewProfileServiceWithSeparation(r.DB, r.DataLoaders.ProfileLoaderForUser)
	return profileService.GetProfileByUserID(ctx, obj.ID)
}

// WorkoutLogs is the resolver for the workoutLogs field.
func (r *userResolver) WorkoutLogs(ctx context.Context, obj *model.User) ([]*model.WorkoutLog, error) {
	workoutLogService := services.NewWorkoutLogServiceWithSeparation(r.DB, r.DataLoaders.SetLogsLoaderForWorkoutLog)
	return workoutLogService.GetWorkoutLogs(ctx, obj.ID)
}

// Friends is the resolver for the friends field.
func (r *userResolver) Friends(ctx context.Context, obj *model.User) ([]*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.GetFriends(ctx, obj.ID)
}

// FriendshipRequests is the resolver for the friendshipRequests field.
func (r *userResolver) FriendshipRequests(ctx context.Context, obj *model.User) ([]*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.GetFriendshipRequests(ctx, obj.ID)
}

// RecommendedUsers is the resolver for the recommendedUsers field.
func (r *userResolver) RecommendedUsers(ctx context.Context, obj *model.User) ([]*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.GetRecommendedUsers(ctx, obj.ID)
}

// ================================
// Query
// ================================

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	userService := services.NewUserServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForUser)
	currentUser, err := userService.GetCurrentUser(ctx)
	if err != nil {
		return nil, err
	}
	if !currentUser.IsAdmin() {
		return nil, fmt.Errorf("unauthorized")
	}

	return userService.GetUsers(ctx)
}

// CurrentUser is the resolver for the currentUser field.
func (r *queryResolver) CurrentUser(ctx context.Context) (*model.User, error) {
	userService := services.NewUserServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForUser)
	return userService.GetOrCreateUserByUID(ctx)
}
