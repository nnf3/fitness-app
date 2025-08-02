package loaders

import (
	"context"

	friendshipLoaders "app/graph/services/friendship/loaders"
	userLoaders "app/graph/services/user/loaders"
	workoutLogLoaders "app/graph/services/workout_log/loaders"
	workoutTypeLoaders "app/graph/services/workout_type/loaders"

	"gorm.io/gorm"
)

type ContextKey string

type DataLoaders struct {
	// User関連
	UserLoaderForUser             friendshipLoaders.UserLoaderInterface
	ProfileLoaderForUser          userLoaders.ProfileLoaderInterface
	WorkoutLogsLoaderForUser      userLoaders.WorkoutLogsLoaderInterface
	FriendsLoaderForUser          userLoaders.FriendsLoaderInterface
	RecommendedUsersLoaderForUser userLoaders.RecommendedUsersLoaderInterface

	// Friendship関連
	UserLoaderForFriendship friendshipLoaders.UserLoaderInterface

	// WorkoutLog関連
	SetLogsLoaderForWorkoutLog workoutLogLoaders.SetLogsLoaderForWorkoutLogInterface

	// WorkoutType関連
	SetLogsLoaderForWorkoutType workoutTypeLoaders.SetLogsLoaderForWorkoutTypeInterface
}

func NewDataLoaders(db *gorm.DB) *DataLoaders {
	return &DataLoaders{
		// User関連
		UserLoaderForUser:             friendshipLoaders.NewUserLoader(db),
		ProfileLoaderForUser:          userLoaders.NewProfileLoader(db),
		WorkoutLogsLoaderForUser:      userLoaders.NewWorkoutLogsLoader(db),
		FriendsLoaderForUser:          userLoaders.NewFriendsLoader(db),
		RecommendedUsersLoaderForUser: userLoaders.NewRecommendedUsersLoader(db),

		// Friendship関連
		UserLoaderForFriendship: friendshipLoaders.NewUserLoader(db),

		// WorkoutLog関連
		SetLogsLoaderForWorkoutLog: workoutLogLoaders.NewSetLogsLoaderForWorkoutLog(db),

		// WorkoutType関連
		SetLogsLoaderForWorkoutType: workoutTypeLoaders.NewSetLogsLoaderForWorkoutType(db),
	}
}

const DataLoadersContextKey ContextKey = "dataLoaders"

func WithDataLoaders(ctx context.Context, db *gorm.DB) context.Context {
	loaders := NewDataLoaders(db)
	return context.WithValue(ctx, DataLoadersContextKey, loaders)
}

func For(ctx context.Context) *DataLoaders {
	loaders, ok := ctx.Value(DataLoadersContextKey).(*DataLoaders)
	if !ok {
		panic("no dataloaders found in context")
	}
	return loaders
}
