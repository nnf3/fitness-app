package workout_exercise

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// WorkoutExerciseDataLoader は WorkoutExercise エンティティの遅延ローディングを担当
type WorkoutExerciseDataLoader struct {
	repository         WorkoutExerciseRepository
	byWorkoutIDLoader  *base.BaseArrayLoader[entity.WorkoutExercise]
	byExerciseIDLoader *base.BaseArrayLoader[entity.WorkoutExercise]
}

// NewWorkoutExerciseDataLoader は新しいDataLoaderを作成
func NewWorkoutExerciseDataLoader(repository WorkoutExerciseRepository) *WorkoutExerciseDataLoader {
	loader := &WorkoutExerciseDataLoader{
		repository: repository,
	}

	// ByWorkoutID用のローダー
	loader.byWorkoutIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByWorkoutIDs,
		loader.createWorkoutIDMap,
		base.ParseUintKey,
	)

	// ByExerciseID用のローダー
	loader.byExerciseIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByExerciseIDs,
		loader.createExerciseIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByWorkoutID は指定されたWorkoutIDに関連するWorkoutExerciseを取得
func (l *WorkoutExerciseDataLoader) LoadByWorkoutID(ctx context.Context, workoutID string) ([]*entity.WorkoutExercise, error) {
	return l.byWorkoutIDLoader.Load(ctx, workoutID)
}

// LoadByExerciseID は指定されたExerciseIDに関連するWorkoutExerciseを取得
func (l *WorkoutExerciseDataLoader) LoadByExerciseID(ctx context.Context, exerciseID string) ([]*entity.WorkoutExercise, error) {
	return l.byExerciseIDLoader.Load(ctx, exerciseID)
}

// fetchByWorkoutIDs はRepository経由でWorkoutID別にデータを取得
func (l *WorkoutExerciseDataLoader) fetchByWorkoutIDs(workoutIDs []uint) ([]*entity.WorkoutExercise, error) {
	return l.repository.GetWorkoutExercisesByWorkoutIDs(workoutIDs)
}

// fetchByExerciseIDs はRepository経由でExerciseID別にデータを取得
func (l *WorkoutExerciseDataLoader) fetchByExerciseIDs(exerciseIDs []uint) ([]*entity.WorkoutExercise, error) {
	return l.repository.GetWorkoutExercisesByExerciseIDs(exerciseIDs)
}

// createWorkoutIDMap はWorkoutID別にデータをマップ化
func (l *WorkoutExerciseDataLoader) createWorkoutIDMap(workoutExercises []*entity.WorkoutExercise) map[uint][]*entity.WorkoutExercise {
	result := make(map[uint][]*entity.WorkoutExercise)
	for _, workoutExercise := range workoutExercises {
		if workoutExercise != nil {
			result[workoutExercise.WorkoutID] = append(result[workoutExercise.WorkoutID], workoutExercise)
		}
	}
	return result
}

// createExerciseIDMap はExerciseID別にデータをマップ化
func (l *WorkoutExerciseDataLoader) createExerciseIDMap(workoutExercises []*entity.WorkoutExercise) map[uint][]*entity.WorkoutExercise {
	result := make(map[uint][]*entity.WorkoutExercise)
	for _, workoutExercise := range workoutExercises {
		if workoutExercise != nil {
			result[workoutExercise.ExerciseID] = append(result[workoutExercise.ExerciseID], workoutExercise)
		}
	}
	return result
}
