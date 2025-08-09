package workout_group

import (
    "app/entity"
    "context"

    "gorm.io/gorm"
)

type WorkoutGroupRepository interface {
    GetWorkoutGroups(ctx context.Context) ([]entity.WorkoutGroup, error)
    GetWorkoutGroupByID(ctx context.Context, id string) (*entity.WorkoutGroup, error)
    GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]entity.User, error)
}

type workoutGroupRepository struct {
    db *gorm.DB
}

func NewWorkoutGroupRepository(db *gorm.DB) WorkoutGroupRepository {
    return &workoutGroupRepository{db: db}
}

func (r *workoutGroupRepository) GetWorkoutGroups(ctx context.Context) ([]entity.WorkoutGroup, error) {
    var groups []entity.WorkoutGroup
    if err := r.db.WithContext(ctx).Find(&groups).Error; err != nil {
        return nil, err
    }
    return groups, nil
}

func (r *workoutGroupRepository) GetWorkoutGroupByID(ctx context.Context, id string) (*entity.WorkoutGroup, error) {
    var group entity.WorkoutGroup
    if err := r.db.WithContext(ctx).First(&group, "id = ?", id).Error; err != nil {
        return nil, err
    }
    return &group, nil
}

func (r *workoutGroupRepository) GetWorkoutGroupMembers(ctx context.Context, groupID string) ([]entity.User, error) {
    var users []entity.User
    err := r.db.WithContext(ctx).
        Joins("inner join workout_logs on users.id = workout_logs.user_id").
        Where("workout_logs.workout_group_id = ?", groupID).
        Find(&users).Error
    return users, err
}