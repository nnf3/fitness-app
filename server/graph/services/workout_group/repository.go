package workout_group

import (
	"app/entity"
	"context"

	"gorm.io/gorm"
)

type WorkoutGroupRepository interface {
	GetWorkoutGroups(ctx context.Context, userID string) ([]entity.WorkoutGroup, error)
	GetWorkoutGroupByID(ctx context.Context, id string, userID string) (*entity.WorkoutGroup, error)
	CreateWorkoutGroup(ctx context.Context, workoutGroup *entity.WorkoutGroup) error
	UpdateWorkoutGroup(ctx context.Context, workoutGroup *entity.WorkoutGroup) error
	DeleteWorkoutGroup(ctx context.Context, id string) error

	// Batch methods for DataLoader
	GetWorkoutGroupsByIDs(workoutGroupIDs []uint) ([]*entity.WorkoutGroup, error)
}

type workoutGroupRepository struct {
	db *gorm.DB
}

func NewWorkoutGroupRepository(db *gorm.DB) WorkoutGroupRepository {
	return &workoutGroupRepository{db: db}
}

func (r *workoutGroupRepository) GetWorkoutGroups(ctx context.Context, userID string) ([]entity.WorkoutGroup, error) {
	var groups []entity.WorkoutGroup
	err := r.db.WithContext(ctx).
		Joins("inner join workouts on workout_groups.id = workouts.workout_group_id").
		Where("workouts.user_id = ?", userID).
		Find(&groups).Error
	if err != nil {
		return nil, err
	}
	return groups, nil
}

func (r *workoutGroupRepository) GetWorkoutGroupByID(ctx context.Context, id string, userID string) (*entity.WorkoutGroup, error) {
	var group entity.WorkoutGroup
	err := r.db.WithContext(ctx).
		Joins("inner join workouts on workout_groups.id = workouts.workout_group_id").
		Where("workouts.user_id = ?", userID).
		Where("workout_groups.id = ?", id).
		First(&group).Error
	if err != nil {
		return nil, err
	}
	return &group, nil
}

func (r *workoutGroupRepository) CreateWorkoutGroup(ctx context.Context, workoutGroup *entity.WorkoutGroup) error {
	return r.db.Create(workoutGroup).Error
}

func (r *workoutGroupRepository) UpdateWorkoutGroup(ctx context.Context, workoutGroup *entity.WorkoutGroup) error {
	return r.db.Save(workoutGroup).Error
}

func (r *workoutGroupRepository) DeleteWorkoutGroup(ctx context.Context, id string) error {
	return r.db.Unscoped().Delete(&entity.WorkoutGroup{}, id).Error
}

// Batch methods for DataLoader
func (r *workoutGroupRepository) GetWorkoutGroupsByIDs(workoutGroupIDs []uint) ([]*entity.WorkoutGroup, error) {
	var groups []*entity.WorkoutGroup
	if err := r.db.Where("id IN (?)", workoutGroupIDs).Find(&groups).Error; err != nil {
		return nil, err
	}
	return groups, nil
}
