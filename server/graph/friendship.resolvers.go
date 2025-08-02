package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// Friendship returns FriendshipResolver implementation.
func (r *Resolver) Friendship() FriendshipResolver { return &friendshipResolver{r} }

type friendshipResolver struct{ *Resolver }

// Requester is the resolver for the requester field.
func (r *friendshipResolver) Requester(ctx context.Context, obj *model.Friendship) (*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.GetFriendshipRequester(ctx, obj.ID)
}

// Requestee is the resolver for the requestee field.
func (r *friendshipResolver) Requestee(ctx context.Context, obj *model.Friendship) (*model.User, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.GetFriendshipRequestee(ctx, obj.ID)
}
