package graph

import (
	"app/graph/model"
	"app/graph/services"
	"app/graph/services/profile"
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
	profileEntity, err := r.DataLoaders.ProfileLoaderForUserDirect.LoadByUserID(ctx, obj.ID)
	if err != nil {
		return nil, err
	}
	if profileEntity == nil {
		return nil, nil
	}

	// エンティティからモデルに変換
	profileConverter := profile.NewProfileConverter()
	return profileConverter.ToModelProfile(*profileEntity), nil
}

// WorkoutLogs is the resolver for the workoutLogs field.
func (r *userResolver) Workouts(ctx context.Context, obj *model.User) ([]*model.Workout, error) {
	workoutService := services.NewWorkoutServiceWithSeparation(r.DB)
	return workoutService.GetWorkoutsByUserID(ctx, obj.ID)
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

// ================================
// Mutation
// ================================

// DeleteUser is the resolver for the deleteUser field.
func (r *mutationResolver) DeleteUser(ctx context.Context, input model.DeleteUser) (bool, error) {
	userService := services.NewUserServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForUser)
	return userService.DeleteUser(ctx, input)
}
