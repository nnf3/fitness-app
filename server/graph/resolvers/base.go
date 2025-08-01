package resolvers

import (
	"app/graph/dataloader"

	"gorm.io/gorm"
)

// BaseResolver は全てのリゾルバーの基底構造体です
type BaseResolver struct {
	DB          *gorm.DB
	DataLoaders *dataloader.DataLoaders
}

// friendshipResolver はFriendshipResolverの実装です
type friendshipResolver struct{ *BaseResolver }

// setLogResolver はSetLogResolverの実装です
type setLogResolver struct{ *BaseResolver }

// userResolver はUserResolverの実装です
type userResolver struct{ *BaseResolver }

// workoutLogResolver はWorkoutLogResolverの実装です
type workoutLogResolver struct{ *BaseResolver }

// workoutTypeResolver はWorkoutTypeResolverの実装です
type workoutTypeResolver struct{ *BaseResolver }
