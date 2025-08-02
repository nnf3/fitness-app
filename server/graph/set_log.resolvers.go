package graph

import (
	"app/graph/model"
	"context"
	"fmt"
)

// SetLog returns SetLogResolver implementation.
func (r *Resolver) SetLog() SetLogResolver { return &setLogResolver{r} }

type setLogResolver struct{ *Resolver }

// WorkoutLog is the resolver for the workoutLog field.
func (r *setLogResolver) WorkoutLog(ctx context.Context, obj *model.SetLog) (*model.WorkoutLog, error) {
	// TODO: Implement WorkoutLog resolver for SetLog
	return nil, fmt.Errorf("not implemented: WorkoutLog - workoutLog")
}

// WorkoutType is the resolver for the workoutType field.
func (r *setLogResolver) WorkoutType(ctx context.Context, obj *model.SetLog) (*model.WorkoutType, error) {
	// TODO: Implement WorkoutType resolver for SetLog
	return nil, fmt.Errorf("not implemented: WorkoutType - workoutType")
}
