package graph

import (
	"app/graph/model"
	"context"
	"fmt"
)

// =============================================================================
// WorkoutLogResolver
// =============================================================================

// SetLogs is the resolver for the setLogs field.
func (r *workoutLogResolver) SetLogs(ctx context.Context, obj *model.WorkoutLog) ([]*model.SetLog, error) {
	panic(fmt.Errorf("not implemented: SetLogs - setLogs"))
}
