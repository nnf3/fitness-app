package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.76

import (
	"app/entity"
	"app/graph/model"
	"context"
	"fmt"
)

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser) (*model.User, error) {
	user := entity.User{
		Name: input.Name,
	}

	if err := r.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	return &model.User{
		ID:   fmt.Sprintf("%d", user.ID),
		Name: user.Name,
	}, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
