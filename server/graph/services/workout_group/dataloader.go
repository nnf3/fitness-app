package workout_group

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// WorkoutGroupDataLoader は WorkoutGroup エンティティの遅延ローディングを担当
type WorkoutGroupDataLoader struct {
	repository WorkoutGroupRepository
	byIDLoader *base.BaseLoader[*entity.WorkoutGroup]
}

// NewWorkoutExerciseDataLoader は新しいDataLoaderを作成
func NewWorkoutGroupDataLoader(repository WorkoutGroupRepository) *WorkoutGroupDataLoader {
	loader := &WorkoutGroupDataLoader{
		repository: repository,
	}

	// ByID用のローダー
	loader.byIDLoader = base.NewBaseLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByIDs,
		loader.createIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByID は指定されたWorkoutGroupIDのWorkoutGroupを取得
func (l *WorkoutGroupDataLoader) LoadByID(ctx context.Context, workoutGroupID string) (*entity.WorkoutGroup, error) {
	return l.byIDLoader.Load(ctx, workoutGroupID)
}

// fetchByIDs はRepository経由でWorkoutGroupID別にデータを取得
func (l *WorkoutGroupDataLoader) fetchByIDs(workoutGroupIDs []uint) ([]*entity.WorkoutGroup, error) {
	return l.repository.GetWorkoutGroupsByIDs(workoutGroupIDs)
}

// createIDMap はWorkoutGroupID別にデータをマップ化
func (l *WorkoutGroupDataLoader) createIDMap(workoutGroups []*entity.WorkoutGroup) map[uint]*entity.WorkoutGroup {
	result := make(map[uint]*entity.WorkoutGroup)
	for _, workoutGroup := range workoutGroups {
		if workoutGroup != nil {
			result[workoutGroup.ID] = workoutGroup
		}
	}
	return result
}
