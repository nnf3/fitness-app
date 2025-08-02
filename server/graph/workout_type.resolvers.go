package graph

import (
	"app/graph/model"
	"context"
	"fmt"
)

// WorkoutType returns WorkoutTypeResolver implementation.
func (r *Resolver) WorkoutType() WorkoutTypeResolver { return &workoutTypeResolver{r} }

type workoutTypeResolver struct{ *Resolver }

// SetLogs is the resolver for the setLogs field.
func (r *workoutTypeResolver) SetLogs(ctx context.Context, obj *model.WorkoutType) ([]*model.SetLog, error) {
	// TODO: Implement SetLogs resolver for WorkoutType
	return nil, fmt.Errorf("not implemented: SetLogs - setLogs")
}
