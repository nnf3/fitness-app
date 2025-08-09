package services

import (
	"app/graph/services/common"
	"app/graph/services/exercise"
	"app/graph/services/friendship"
	"app/graph/services/profile"
	"app/graph/services/set_log"
	"app/graph/services/user"
	"app/graph/services/workout"
	"app/graph/services/workout_exercise"

	friendshipLoaders "app/graph/services/friendship/loaders"
	userLoaders "app/graph/services/user/loaders"

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

// NewExerciseServiceWithSeparation は分離されたExerciseServiceを作成します
func NewExerciseServiceWithSeparation(db *gorm.DB) exercise.ExerciseService {
	repo := exercise.NewExerciseRepository(db)
	converter := exercise.NewExerciseConverter()
	return exercise.NewExerciseService(repo, converter)
}

// NewWorkoutServiceWithSeparation は分離されたWorkoutServiceを作成します
func NewWorkoutServiceWithSeparation(db *gorm.DB) workout.WorkoutService {
	repo := workout.NewWorkoutRepository(db)
	converter := workout.NewWorkoutConverter()
	return workout.NewWorkoutService(repo, converter)
}

// NewWorkoutExerciseServiceWithSeparation は分離されたWorkoutExerciseServiceを作成します
func NewWorkoutExerciseServiceWithSeparation(db *gorm.DB) workout_exercise.WorkoutExerciseService {
	repo := workout_exercise.NewWorkoutExerciseRepository(db)
	converter := workout_exercise.NewWorkoutExerciseConverter()
	return workout_exercise.NewWorkoutExerciseService(repo, converter)
}

// NewSetLogServiceWithSeparation は分離されたSetLogServiceを作成します
func NewSetLogServiceWithSeparation(db *gorm.DB) set_log.SetLogService {
	repo := set_log.NewSetLogRepository(db)
	converter := set_log.NewSetLogConverter()
	return set_log.NewSetLogService(repo, converter)
}

// 共通のConverterを取得する関数
func NewCommonConverter() *common.CommonConverter {
	return common.NewCommonConverter()
}

// 共通のRepositoryを取得する関数
func NewCommonRepository(db *gorm.DB) common.CommonRepository {
	return common.NewCommonRepository(db)
}
