package loaders

import (
    "app/entity"
    "app/graph/services/common/base"
    "context"

    "gorm.io/gorm"
)

// WorkoutGroupLoaderInterface defines the interface for loading WorkoutGroup by ID.
type WorkoutGroupLoaderInterface interface {
    LoadByID(ctx context.Context, id string) (*entity.WorkoutGroup, error)
}

// WorkoutGroupLoader implements WorkoutGroupLoaderInterface using BaseLoader.
type WorkoutGroupLoader struct {
    *base.BaseLoader[*entity.WorkoutGroup]
}

// NewWorkoutGroupLoader creates a new WorkoutGroupLoader.
func NewWorkoutGroupLoader(db *gorm.DB) WorkoutGroupLoaderInterface {
    loader := &WorkoutGroupLoader{}
    loader.BaseLoader = base.NewBaseLoader(
        db,
        loader.fetchWorkoutGroupsFromDB,
        func(groups []*entity.WorkoutGroup) map[uint]*entity.WorkoutGroup {
            m := make(map[uint]*entity.WorkoutGroup, len(groups))
            for _, g := range groups {
                m[g.ID] = g
            }
            return m
        },
        base.ParseUintKey,
    )
    return loader
}

// fetchWorkoutGroupsFromDB fetches WorkoutGroup entities by IDs from the database.
func (l *WorkoutGroupLoader) fetchWorkoutGroupsFromDB(ids []uint) ([]*entity.WorkoutGroup, error) {
    var groups []entity.WorkoutGroup
    if err := l.DB().Where("id IN ?", ids).Find(&groups).Error; err != nil {
        return nil, err
    }
    result := make([]*entity.WorkoutGroup, len(groups))
    for i := range groups {
        result[i] = &groups[i]
    }
    return result, nil
}

// LoadByID loads a WorkoutGroup by its string ID.
func (l *WorkoutGroupLoader) LoadByID(ctx context.Context, id string) (*entity.WorkoutGroup, error) {
    return l.Load(ctx, id)
}