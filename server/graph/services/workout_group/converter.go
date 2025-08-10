package workout_group

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"fmt"
	"time"
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
	formatDate := func(t *time.Time) *string {
		if t == nil {
			return nil
		}
		formatted := t.Format(common.DateFormat)
		return &formatted
	}

	return &model.WorkoutGroup{
		ID:        fmt.Sprint(group.ID),
		Title:     group.Title,
		Date:      formatDate(group.Date),
		ImageURL:  group.ImageURL,
		CreatedAt: group.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: group.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

// User変換はCommonConverterを使用
func (c *WorkoutGroupConverter) ToModelUsers(user []entity.User) []*model.User {
	return c.common.ToModelUsers(user)
}
