package loaders

import (
	"context"

	friendshipLoaders "app/graph/services/friendship/loaders"
	setLogLoaders "app/graph/services/set_log/loaders"
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
	SetLogsLoaderForWorkoutLog workoutLogLoaders.SetLogsLoaderInterface

	// WorkoutType関連
	SetLogsLoaderForWorkoutType workoutTypeLoaders.SetLogsLoaderForWorkoutTypeInterface

	// SetLog関連
	WorkoutTypeLoaderForSetLog setLogLoaders.WorkoutTypeLoaderInterface

	// Profile関連
	ProfileLoaderForUserDirect userLoaders.ProfileLoaderInterface

	// WorkoutLogs関連
	WorkoutLogsLoaderForUserDirect userLoaders.WorkoutLogsLoaderInterface

	// SetLogs関連
	SetLogsLoaderForWorkoutLogDirect workoutLogLoaders.SetLogsLoaderInterface
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
		SetLogsLoaderForWorkoutLog: workoutLogLoaders.NewSetLogsLoader(db),

		// WorkoutType関連
		SetLogsLoaderForWorkoutType: workoutTypeLoaders.NewSetLogsLoaderForWorkoutType(db),

		// SetLog関連
		WorkoutTypeLoaderForSetLog: setLogLoaders.NewWorkoutTypeLoader(db),

		// Profile関連
		ProfileLoaderForUserDirect: userLoaders.NewProfileLoader(db),

		// WorkoutLogs関連
		WorkoutLogsLoaderForUserDirect: userLoaders.NewWorkoutLogsLoader(db),

		// SetLogs関連
		SetLogsLoaderForWorkoutLogDirect: workoutLogLoaders.NewSetLogsLoader(db),
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
