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
	"app/graph/services/workout_group"

	"gorm.io/gorm"
)

// 新しい分離されたサービス構造のファクトリー関数

// NewFriendshipServiceWithSeparation は分離されたFriendshipServiceを作成します
func NewFriendshipServiceWithSeparation(db *gorm.DB) friendship.FriendshipService {
	repo := friendship.NewFriendshipRepository(db)
	converter := friendship.NewFriendshipConverter()
	return friendship.NewFriendshipService(repo, converter)
}

// NewUserServiceWithSeparation は分離されたUserServiceを作成します
func NewUserServiceWithSeparation(db *gorm.DB) user.UserService {
	repo := user.NewUserRepository(db)
	converter := user.NewUserConverter()
	dataLoader := user.NewUserDataLoader(repo)
	return user.NewUserService(repo, converter, dataLoader)
}

// NewProfileServiceWithSeparation は分離されたProfileServiceを作成します
func NewProfileServiceWithSeparation(db *gorm.DB) profile.ProfileService {
	repo := profile.NewProfileRepository(db)
	converter := profile.NewProfileConverter()
	dataLoader := profile.NewProfileDataLoader(repo)
	return profile.NewProfileService(repo, converter, dataLoader)
}

// NewExerciseServiceWithSeparation は分離されたExerciseServiceを作成します
func NewExerciseServiceWithSeparation(db *gorm.DB) exercise.ExerciseService {
	repo := exercise.NewExerciseRepository(db)
	converter := exercise.NewExerciseConverter()
	dataLoader := exercise.NewExerciseDataLoader(repo)
	return exercise.NewExerciseService(repo, converter, dataLoader)
}

// NewWorkoutServiceWithSeparation は分離されたWorkoutServiceを作成します
func NewWorkoutServiceWithSeparation(db *gorm.DB) workout.WorkoutService {
	repo := workout.NewWorkoutRepository(db)
	converter := workout.NewWorkoutConverter()
	dataLoader := workout.NewWorkoutDataLoader(repo)
	return workout.NewWorkoutService(repo, converter, dataLoader)
}

// NewWorkoutGroupServiceWithSeparation は分離されたWorkoutGroupServiceを作成します
func NewWorkoutGroupServiceWithSeparation(db *gorm.DB) workout_group.WorkoutGroupService {
	repo := workout_group.NewWorkoutGroupRepository(db)
	converter := workout_group.NewWorkoutGroupConverter()
	dataLoader := workout_group.NewWorkoutGroupDataLoader(repo)
	return workout_group.NewWorkoutGroupService(repo, converter, dataLoader)
}

// NewWorkoutExerciseServiceWithSeparation は分離されたWorkoutExerciseServiceを作成します
func NewWorkoutExerciseServiceWithSeparation(db *gorm.DB) workout_exercise.WorkoutExerciseService {
	repo := workout_exercise.NewWorkoutExerciseRepository(db)
	converter := workout_exercise.NewWorkoutExerciseConverter()
	dataLoader := workout_exercise.NewWorkoutExerciseDataLoader(repo)
	return workout_exercise.NewWorkoutExerciseService(repo, converter, dataLoader)
}

// NewSetLogServiceWithSeparation は分離されたSetLogServiceを作成します
func NewSetLogServiceWithSeparation(db *gorm.DB) set_log.SetLogService {
	repo := set_log.NewSetLogRepository(db)
	converter := set_log.NewSetLogConverter()
	dataLoader := set_log.NewSetLogDataLoader(repo)
	return set_log.NewSetLogService(repo, converter, dataLoader)
}

// 共通のConverterを取得する関数
func NewCommonConverter() *common.CommonConverter {
	return common.NewCommonConverter()
}

// 共通のRepositoryを取得する関数
func NewCommonRepository(db *gorm.DB) common.CommonRepository {
	return common.NewCommonRepository(db)
}
