package set_log

import (
	"app/entity"
	"app/graph/services/common/base"
	"context"
)

// SetLogDataLoader は SetLog エンティティの遅延ローディングを担当
type SetLogDataLoader struct {
	repository                SetLogRepository
	byWorkoutExerciseIDLoader *base.BaseArrayLoader[entity.SetLog]
}

// NewSetLogDataLoader は新しいDataLoaderを作成
func NewSetLogDataLoader(repository SetLogRepository) *SetLogDataLoader {
	loader := &SetLogDataLoader{
		repository: repository,
	}

	// ByWorkoutExerciseID用のローダー
	loader.byWorkoutExerciseIDLoader = base.NewBaseArrayLoader(
		nil, // dbは不要（repositoryを使用）
		loader.fetchByWorkoutExerciseIDs,
		loader.createWorkoutExerciseIDMap,
		base.ParseUintKey,
	)

	return loader
}

// LoadByWorkoutExerciseID は指定されたWorkoutExerciseIDのSetLogsを取得
func (l *SetLogDataLoader) LoadByWorkoutExerciseID(ctx context.Context, workoutExerciseID string) ([]*entity.SetLog, error) {
	return l.byWorkoutExerciseIDLoader.Load(ctx, workoutExerciseID)
}

// fetchByWorkoutExerciseIDs はRepository経由でWorkoutExerciseID別にデータを取得
func (l *SetLogDataLoader) fetchByWorkoutExerciseIDs(workoutExerciseIDs []uint) ([]*entity.SetLog, error) {
	return l.repository.GetSetLogsByWorkoutExerciseIDs(workoutExerciseIDs)
}

// createWorkoutExerciseIDMap はWorkoutExerciseID別にデータをマップ化
func (l *SetLogDataLoader) createWorkoutExerciseIDMap(setLogs []*entity.SetLog) map[uint][]*entity.SetLog {
	result := make(map[uint][]*entity.SetLog)
	for _, setLog := range setLogs {
		if setLog != nil {
			result[setLog.WorkoutExerciseID] = append(result[setLog.WorkoutExerciseID], setLog)
		}
	}
	return result
}
