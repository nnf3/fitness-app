package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Model
// ================================
// Exercise returns ExerciseResolver implementation.
// func (r *Resolver) Exercise() ExerciseResolver { return &exerciseResolver{r} }

// type exerciseResolver struct{ *Resolver }

// ================================
// Query
// ================================
// Exercises is the resolver for the exercises field.
func (r *queryResolver) Exercises(ctx context.Context) ([]*model.Exercise, error) {
	exerciseService := services.NewExerciseServiceWithSeparation(r.DB)
	return exerciseService.GetExercises(ctx)
}
