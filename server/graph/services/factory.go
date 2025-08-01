package services

import (
	"app/graph/services/common"
	"app/graph/services/friendship"
	"app/graph/services/profile"
	"app/graph/services/set_log"
	"app/graph/services/user"
	"app/graph/services/workout_log"
	"app/graph/services/workout_type"

	friendshipLoaders "app/graph/services/friendship/loaders"
	userLoaders "app/graph/services/user/loaders"
	workoutLogLoaders "app/graph/services/workout_log/loaders"
	workoutTypeLoaders "app/graph/services/workout_type/loaders"

	"gorm.io/gorm"
)

// 新しい分離されたサービス構造のファクトリー関数

// NewFriendshipServiceWithSeparation は分離されたFriendshipServiceを作成します
func NewFriendshipServiceWithSeparation(db *gorm.DB, userLoader friendshipLoaders.UserLoaderInterface) friendship.FriendshipService {
	repo := friendship.NewFriendshipRepository(db)
	userRepo := user.NewUserRepository(db)
	converter := friendship.NewFriendshipConverter()
	return friendship.NewFriendshipServiceWithUserLoader(repo, userRepo, converter, userLoader)
}

// NewUserServiceWithSeparation は分離されたUserServiceを作成します
func NewUserServiceWithSeparation(db *gorm.DB, loader friendshipLoaders.UserLoaderInterface) user.UserService {
	repo := user.NewUserRepository(db)
	converter := user.NewUserConverter()
	return user.NewUserServiceWithDataLoader(repo, converter, loader)
}

// NewProfileServiceWithSeparation は分離されたProfileServiceを作成します
func NewProfileServiceWithSeparation(db *gorm.DB, loader userLoaders.ProfileLoaderInterface) profile.ProfileService {
	repo := profile.NewProfileRepository(db)
	converter := profile.NewProfileConverter()
	return profile.NewProfileService(repo, converter, loader)
}

// NewWorkoutLogServiceWithSeparation は分離されたWorkoutLogServiceを作成します
func NewWorkoutLogServiceWithSeparation(db *gorm.DB, loader workoutLogLoaders.SetLogsLoaderInterface) workout_log.WorkoutLogService {
	repo := workout_log.NewWorkoutLogRepository(db)
	converter := workout_log.NewWorkoutLogConverter()
	return workout_log.NewWorkoutLogService(repo, converter)
}

// NewSetLogServiceWithSeparation は分離されたSetLogServiceを作成します
func NewSetLogServiceWithSeparation(db *gorm.DB) set_log.SetLogService {
	repo := set_log.NewSetLogRepository(db)
	converter := set_log.NewSetLogConverter()
	return set_log.NewSetLogService(repo, converter)
}

// NewWorkoutTypeServiceWithSeparation は分離されたWorkoutTypeServiceを作成します
func NewWorkoutTypeServiceWithSeparation(db *gorm.DB, loader workoutTypeLoaders.SetLogsLoaderForWorkoutTypeInterface) workout_type.WorkoutTypeService {
	repo := workout_type.NewWorkoutTypeRepository(db)
	converter := workout_type.NewWorkoutTypeConverter()
	return workout_type.NewWorkoutTypeServiceWithLoader(repo, converter, loader)
}

// 共通のConverterを取得する関数
func NewCommonConverter() *common.CommonConverter {
	return common.NewCommonConverter()
}

// 共通のRepositoryを取得する関数
func NewCommonRepository(db *gorm.DB) common.CommonRepository {
	return common.NewCommonRepository(db)
}
