package graph

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// ================================
// Model
// ================================

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

// ================================
// Mutation
// ================================

// SendFriendshipRequest is the resolver for the sendFriendshipRequest field.
func (r *mutationResolver) SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.SendFriendshipRequest(ctx, input)
}

// AcceptFriendshipRequest is the resolver for the acceptFriendshipRequest field.
func (r *mutationResolver) AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.AcceptFriendshipRequest(ctx, input)
}

// RejectFriendshipRequest is the resolver for the rejectFriendshipRequest field.
func (r *mutationResolver) RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB, r.DataLoaders.UserLoaderForFriendship)
	return friendshipService.RejectFriendshipRequest(ctx, input)
}
