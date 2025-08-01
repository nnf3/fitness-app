package graph

import (
	"app/graph/model"
	"context"
	"fmt"
)

// =============================================================================
// SetLogResolver
// =============================================================================

// WorkoutLog is the resolver for the workoutLog field.
func (r *setLogResolver) WorkoutLog(ctx context.Context, obj *model.SetLog) (*model.WorkoutLog, error) {
	panic(fmt.Errorf("not implemented: WorkoutLog - workoutLog"))
}

// WorkoutType is the resolver for the workoutType field.
func (r *setLogResolver) WorkoutType(ctx context.Context, obj *model.SetLog) (*model.WorkoutType, error) {
	panic(fmt.Errorf("not implemented: WorkoutType - workoutType"))
}
