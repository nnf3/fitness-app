package workout

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// WorkoutDataLoader は Workout エンティティの遅延ローディングを担当
type WorkoutDataLoader struct {
	repository     WorkoutRepository
	byIDLoader     *base.BaseLoader[*entity.Workout]
	byUserIDLoader *base.BaseArrayLoader[entity.Workout]
}

// NewWorkoutDataLoader は新しいDataLoaderを作成
func NewWorkoutDataLoader(repository WorkoutRepository) *WorkoutDataLoader {
	loader := &WorkoutDataLoader{
		repository: repository,
	}

	// ByID用のローダー
	loader.byIDLoader = base.NewBaseLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByIDs,
		loader.createIDMap,
		base.ParseUintKey,
	)

	// ByUserID用のローダー
	loader.byUserIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByUserIDs,
		loader.createUserIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByID は指定されたWorkoutIDのWorkoutを取得
func (l *WorkoutDataLoader) LoadByID(ctx context.Context, workoutID string) (*entity.Workout, error) {
	return l.byIDLoader.Load(ctx, workoutID)
}

// LoadByUserID は指定されたUserIDのWorkoutsを取得
func (l *WorkoutDataLoader) LoadByUserID(ctx context.Context, userID string) ([]*entity.Workout, error) {
	return l.byUserIDLoader.Load(ctx, userID)
}

// fetchByIDs はRepository経由でWorkoutID別にデータを取得
func (l *WorkoutDataLoader) fetchByIDs(workoutIDs []uint) ([]*entity.Workout, error) {
	return l.repository.GetWorkoutsByIDs(workoutIDs)
}

// fetchByUserIDs はRepository経由でUserID別にデータを取得
func (l *WorkoutDataLoader) fetchByUserIDs(userIDs []uint) ([]*entity.Workout, error) {
	return l.repository.GetWorkoutsByUserIDs(userIDs)
}

// createIDMap はWorkoutID別にデータをマップ化
func (l *WorkoutDataLoader) createIDMap(workouts []*entity.Workout) map[uint]*entity.Workout {
	result := make(map[uint]*entity.Workout)
	for _, workout := range workouts {
		if workout != nil {
			result[workout.ID] = workout
		}
	}
	return result
}

// createUserIDMap はUserID別にデータをマップ化
func (l *WorkoutDataLoader) createUserIDMap(workouts []*entity.Workout) map[uint][]*entity.Workout {
	result := make(map[uint][]*entity.Workout)
	for _, workout := range workouts {
		if workout != nil {
			result[workout.UserID] = append(result[workout.UserID], workout)
		}
	}
	return result
}
