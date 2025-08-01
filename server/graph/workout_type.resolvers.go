package graph

import (
	"app/graph/model"
	"context"
	"fmt"
)

// =============================================================================
// WorkoutTypeResolver
// =============================================================================

// SetLogs is the resolver for the setLogs field.
func (r *workoutTypeResolver) SetLogs(ctx context.Context, obj *model.WorkoutType) ([]*model.SetLog, error) {
	panic(fmt.Errorf("not implemented: SetLogs - setLogs"))
}
