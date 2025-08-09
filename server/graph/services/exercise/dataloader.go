package exercise

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// ExerciseDataLoader は Exercise エンティティの遅延ローディングを担当
type ExerciseDataLoader struct {
	repository ExerciseRepository
	byIDLoader *base.BaseLoader[*entity.Exercise]
}

// NewExerciseDataLoader は新しいDataLoaderを作成
func NewExerciseDataLoader(repository ExerciseRepository) *ExerciseDataLoader {
	loader := &ExerciseDataLoader{
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

// LoadByID は指定されたExerciseIDのExerciseを取得
func (l *ExerciseDataLoader) LoadByID(ctx context.Context, exerciseID string) (*entity.Exercise, error) {
	return l.byIDLoader.Load(ctx, exerciseID)
}

// fetchByIDs はRepository経由でExerciseID別にデータを取得
func (l *ExerciseDataLoader) fetchByIDs(exerciseIDs []uint) ([]*entity.Exercise, error) {
	return l.repository.GetExercisesByIDs(exerciseIDs)
}

// createIDMap はExerciseID別にデータをマップ化
func (l *ExerciseDataLoader) createIDMap(exercises []*entity.Exercise) map[uint]*entity.Exercise {
	result := make(map[uint]*entity.Exercise)
	for _, exercise := range exercises {
		if exercise != nil {
			result[exercise.ID] = exercise
		}
	}
	return result
}
