package loaders

import (
    "app/entity"
    "app/graph/services/common/base"
    "context"

    "gorm.io/gorm"
)

type WorkoutLogsLoaderForWorkoutGroupInterface interface {
    LoadByWorkoutGroupID(ctx context.Context, groupID string) ([]*entity.WorkoutLog, error)
}

type WorkoutLogsLoader struct {
    *base.BaseArrayLoader[entity.WorkoutLog]
}

func NewWorkoutLogsLoader(db *gorm.DB) WorkoutLogsLoaderForWorkoutGroupInterface {
    loader := &WorkoutLogsLoader{}
    loader.BaseArrayLoader = base.NewBaseArrayLoader(
        db,
        loader.fetchWorkoutLogsFromDB,
        loader.createWorkoutLogMap,
        base.ParseUintKey,
    )
    return loader
}

func (l *WorkoutLogsLoader) fetchWorkoutLogsFromDB(groupIDs []uint) ([]*entity.WorkoutLog, error) {
    var logs []entity.WorkoutLog
    err := l.DB().Where("workout_group_id IN ?", groupIDs).Find(&logs).Error
    if err != nil {
        return nil, err
    }
    result := make([]*entity.WorkoutLog, len(logs))
    for i := range logs {
        result[i] = &logs[i]
    }
    return result, nil
}

func (l *WorkoutLogsLoader) createWorkoutLogMap(logs []*entity.WorkoutLog) map[uint][]*entity.WorkoutLog {
    logMap := make(map[uint][]*entity.WorkoutLog)
    for _, log := range logs {
        if log.WorkoutGroupID != nil {
            logMap[*log.WorkoutGroupID] = append(logMap[*log.WorkoutGroupID], log)
        }
    }
    return logMap
}

func (l *WorkoutLogsLoader) LoadByWorkoutGroupID(ctx context.Context, groupID string) ([]*entity.WorkoutLog, error) {
    return l.Load(ctx, groupID)
}