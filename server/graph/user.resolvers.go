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
	profileService := services.NewProfileServiceWithSeparation(r.DB)
	return profileService.GetProfileByUserID(ctx, obj.ID)
}

// WorkoutLogs is the resolver for the workoutLogs field.
func (r *userResolver) Workouts(ctx context.Context, obj *model.User) ([]*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.GetWorkoutsByUserIDWithDataLoader(ctx, obj.ID)
}

// Friends is the resolver for the friends field.
func (r *userResolver) Friends(ctx context.Context, obj *model.User) ([]*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.GetFriendsWithDataLoader(ctx, obj.ID)
}

// FriendshipRequests is the resolver for the friendshipRequests field.
func (r *userResolver) FriendshipRequests(ctx context.Context, obj *model.User) ([]*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.GetFriendshipRequestsWithDataLoader(ctx, obj.ID)
}

// RecommendedUsers is the resolver for the recommendedUsers field.
func (r *userResolver) RecommendedUsers(ctx context.Context, obj *model.User) ([]*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.GetRecommendedUsersWithDataLoader(ctx, obj.ID)
}

// ================================
// Query
// ================================

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	userService := services.NewUserServiceWithSeparation(r.DB)
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
	userService := services.NewUserServiceWithSeparation(r.DB)
	return userService.GetOrCreateUserByUID(ctx)
}

// ================================
// Mutation
// ================================

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, input model.DeleteUser) (bool, error) {
	userService := services.NewUserServiceWithSeparation(r.DB)
	return userService.DeleteUser(ctx, input)
}
