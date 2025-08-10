package workout_group

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"fmt"
)

type WorkoutGroupConverter struct {
	common *common.CommonConverter
}

func NewWorkoutGroupConverter() *WorkoutGroupConverter {
	return &WorkoutGroupConverter{}
}

func (c *WorkoutGroupConverter) ToModelWorkoutGroups(groups []entity.WorkoutGroup) []*model.WorkoutGroup {
	result := make([]*model.WorkoutGroup, 0, len(groups))
	for _, g := range groups {
		result = append(result, c.ToModelWorkoutGroup(g))
	}
	return result
}

func (c *WorkoutGroupConverter) ToModelWorkoutGroup(group entity.WorkoutGroup) *model.WorkoutGroup {
	return &model.WorkoutGroup{
		ID:        fmt.Sprint(group.ID),
		Title:     group.Title,
		CreatedAt: group.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: group.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		// workoutLogsは必要に応じて追加
	}
}

// User変換はCommonConverterを使用
func (c *WorkoutGroupConverter) ToModelUsers(user []entity.User) []*model.User {
	return c.common.ToModelUsers(user)
}
