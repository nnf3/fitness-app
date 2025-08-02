package set_log

import (
	"app/entity"
	"app/graph/model"
	"fmt"
)

type SetLogConverter struct{}

func NewSetLogConverter() *SetLogConverter {
	return &SetLogConverter{}
}

func (c *SetLogConverter) ToModelSetLog(setLog entity.SetLog) *model.SetLog {
	return &model.SetLog{
		ID:            fmt.Sprintf("%d", setLog.ID),
		WorkoutTypeID: fmt.Sprintf("%d", setLog.WorkoutTypeID),
		Weight:        int32(setLog.Weight),
		RepCount:      int32(setLog.RepCount),
		SetNumber:     int32(setLog.SetNumber),
	}
}

func (c *SetLogConverter) ToModelSetLogs(setLogs []entity.SetLog) []*model.SetLog {
	result := make([]*model.SetLog, len(setLogs))
	for i, setLog := range setLogs {
		result[i] = c.ToModelSetLog(setLog)
	}
	return result
}

func (c *SetLogConverter) ToModelSetLogsFromPointers(setLogs []*entity.SetLog) []*model.SetLog {
	result := make([]*model.SetLog, len(setLogs))
	for i, setLog := range setLogs {
		if setLog != nil {
			result[i] = c.ToModelSetLog(*setLog)
		}
	}
	return result
}
