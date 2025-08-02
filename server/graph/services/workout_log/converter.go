package workout_log

import (
	"app/entity"
	"app/graph/model"
	"fmt"
	"time"
)

type WorkoutLogConverter struct{}

func NewWorkoutLogConverter() *WorkoutLogConverter {
	return &WorkoutLogConverter{}
}

func (c *WorkoutLogConverter) ToModelWorkoutLog(workoutLog entity.WorkoutLog) *model.WorkoutLog {
	return &model.WorkoutLog{
		ID:        fmt.Sprintf("%d", workoutLog.ID),
		CreatedAt: workoutLog.CreatedAt.Format(time.RFC3339),
		UpdatedAt: workoutLog.UpdatedAt.Format(time.RFC3339),
	}
}

func (c *WorkoutLogConverter) ToModelWorkoutLogs(workoutLogs []entity.WorkoutLog) []*model.WorkoutLog {
	result := make([]*model.WorkoutLog, len(workoutLogs))
	for i, workoutLog := range workoutLogs {
		result[i] = c.ToModelWorkoutLog(workoutLog)
	}
	return result
}

func (c *WorkoutLogConverter) ToModelWorkoutLogsFromPointers(workoutLogs []*entity.WorkoutLog) []*model.WorkoutLog {
	result := make([]*model.WorkoutLog, len(workoutLogs))
	for i, workoutLog := range workoutLogs {
		if workoutLog != nil {
			result[i] = c.ToModelWorkoutLog(*workoutLog)
		}
	}
	return result
}
