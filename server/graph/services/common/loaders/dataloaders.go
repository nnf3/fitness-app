package loaders

import (
	"context"

	friendshipLoaders "app/graph/services/friendship/loaders"
	userLoaders "app/graph/services/user/loaders"

	"gorm.io/gorm"
)

type ContextKey string

type DataLoaders struct {
	// User関連
	UserLoaderForUser             friendshipLoaders.UserLoaderInterface
	ProfileLoaderForUser          userLoaders.ProfileLoaderInterface
	WorkoutsLoaderForUser         userLoaders.WorkoutsLoaderInterface
	FriendsLoaderForUser          userLoaders.FriendsLoaderInterface
	RecommendedUsersLoaderForUser userLoaders.RecommendedUsersLoaderInterface

	// Friendship関連
	UserLoaderForFriendship friendshipLoaders.UserLoaderInterface

	// Profile関連
	ProfileLoaderForUserDirect userLoaders.ProfileLoaderInterface
}

func NewDataLoaders(db *gorm.DB) *DataLoaders {
	return &DataLoaders{
		// User関連
		UserLoaderForUser:             friendshipLoaders.NewUserLoader(db),
		ProfileLoaderForUser:          userLoaders.NewProfileLoader(db),
		WorkoutsLoaderForUser:         userLoaders.NewWorkoutsLoader(db),
		FriendsLoaderForUser:          userLoaders.NewFriendsLoader(db),
		RecommendedUsersLoaderForUser: userLoaders.NewRecommendedUsersLoader(db),

		// Friendship関連
		UserLoaderForFriendship: friendshipLoaders.NewUserLoader(db),

		// Profile関連
		ProfileLoaderForUserDirect: userLoaders.NewProfileLoader(db),
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
