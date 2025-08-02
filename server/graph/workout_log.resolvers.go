package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// WorkoutLog returns WorkoutLogResolver implementation.
func (r *Resolver) WorkoutLog() WorkoutLogResolver { return &workoutLogResolver{r} }

type workoutLogResolver struct{ *Resolver }

// SetLogs is the resolver for the setLogs field.
func (r *workoutLogResolver) SetLogs(ctx context.Context, obj *model.WorkoutLog) ([]*model.SetLog, error) {
	setLogService := services.NewSetLogServiceWithSeparation(r.DB)
	return setLogService.GetSetLogs(ctx, obj.ID)
}
