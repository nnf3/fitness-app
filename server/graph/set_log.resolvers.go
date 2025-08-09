package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Mutation
// ================================

// AddSetLog is the resolver for the addSetLog field.
func (r *mutationResolver) CreateSetLog(ctx context.Context, input model.CreateSetLog) (*model.SetLog, error) {
	setLogService := services.NewSetLogServiceWithSeparation(r.DB)
	return setLogService.CreateSetLog(ctx, input)
}

func (r *mutationResolver) DeleteSetLog(ctx context.Context, input model.DeleteSetLog) (bool, error) {
	setLogService := services.NewSetLogServiceWithSeparation(r.DB)
	return setLogService.DeleteSetLog(ctx, input)
}
