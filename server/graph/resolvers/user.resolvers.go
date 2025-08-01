package resolvers

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// =============================================================================
// UserResolver
// =============================================================================

// Profile is the resolver for the profile field.
func (r *userResolver) Profile(ctx context.Context, obj *model.User) (*model.Profile, error) {
	profileService := services.NewProfileService(r.DB, r.DataLoaders.ProfileLoader)
	return profileService.GetProfileByUserID(ctx, obj.ID)
}

// WorkoutLogs is the resolver for the workoutLogs field.
func (r *userResolver) WorkoutLogs(ctx context.Context, obj *model.User) ([]*model.WorkoutLog, error) {
	workoutLogService := services.NewWorkoutLogsService(r.DataLoaders.WorkoutLogLoader)
	return workoutLogService.GetWorkoutLogs(ctx, obj.ID)
}

// Friendships is the resolver for the friendships field.
func (r *userResolver) Friendships(ctx context.Context, obj *model.User) ([]*model.Friendship, error) {
	friendshipService := services.NewFriendshipService(r.DB, r.DataLoaders.FriendshipLoader)
	return friendshipService.GetFriendships(ctx, obj.ID)
}
