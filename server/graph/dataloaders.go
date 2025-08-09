package graph

import (
	"app/graph/services/exercise"
	"app/graph/services/friendship"
	"app/graph/services/profile"
	"app/graph/services/set_log"
	"app/graph/services/user"
	"app/graph/services/workout"
	"app/graph/services/workout_exercise"
	"context"

	"gorm.io/gorm"
)

type ContextKey string

// DataLoaders は新しいエンティティ単位のDataLoadersを管理
type DataLoaders struct {
	// エンティティ別DataLoaders
	User            *user.UserDataLoader
	Profile         *profile.ProfileDataLoader
	WorkoutExercise *workout_exercise.WorkoutExerciseDataLoader
	Exercise        *exercise.ExerciseDataLoader
	Friendship      *friendship.FriendshipDataLoader
	Workout         *workout.WorkoutDataLoader
	SetLog          *set_log.SetLogDataLoader
}

// NewDataLoaders は新しいDataLoadersを作成
func NewDataLoaders(db *gorm.DB) *DataLoaders {
	// 各エンティティのRepositoryを作成
	userRepo := user.NewUserRepository(db)
	profileRepo := profile.NewProfileRepository(db)
	workoutExerciseRepo := workout_exercise.NewWorkoutExerciseRepository(db)
	exerciseRepo := exercise.NewExerciseRepository(db)
	friendshipRepo := friendship.NewFriendshipRepository(db)
	workoutRepo := workout.NewWorkoutRepository(db)
	setLogRepo := set_log.NewSetLogRepository(db)

	return &DataLoaders{
		User:            user.NewUserDataLoader(userRepo),
		Profile:         profile.NewProfileDataLoader(profileRepo),
		WorkoutExercise: workout_exercise.NewWorkoutExerciseDataLoader(workoutExerciseRepo),
		Exercise:        exercise.NewExerciseDataLoader(exerciseRepo),
		Friendship:      friendship.NewFriendshipDataLoader(friendshipRepo),
		Workout:         workout.NewWorkoutDataLoader(workoutRepo),
		SetLog:          set_log.NewSetLogDataLoader(setLogRepo),
	}
}

const DataLoadersContextKey ContextKey = "dataLoaders"

// WithDataLoaders はcontextにDataLoadersを設定
func WithDataLoaders(ctx context.Context, db *gorm.DB) context.Context {
	loaders := NewDataLoaders(db)
	return context.WithValue(ctx, DataLoadersContextKey, loaders)
}

// For はcontextからDataLoadersを取得
func For(ctx context.Context) *DataLoaders {
	loaders, ok := ctx.Value(DataLoadersContextKey).(*DataLoaders)
	if !ok {
		panic("no dataloaders found in context")
	}
	return loaders
}
