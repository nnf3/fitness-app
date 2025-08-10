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
	userService := services.NewUserServiceWithSeparation(r.DB)
	return userService.GetUserByIDWithDataLoader(ctx, obj.RequesterID)
}

// Requestee is the resolver for the requestee field.
func (r *friendshipResolver) Requestee(ctx context.Context, obj *model.Friendship) (*model.User, error) {
	userService := services.NewUserServiceWithSeparation(r.DB)
	return userService.GetUserByIDWithDataLoader(ctx, obj.RequesteeID)
}

// ================================
// Mutation
// ================================

// SendFriendshipRequest is the resolver for the sendFriendshipRequest field.
func (r *mutationResolver) SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.SendFriendshipRequest(ctx, input)
}

// AcceptFriendshipRequest is the resolver for the acceptFriendshipRequest field.
func (r *mutationResolver) AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.AcceptFriendshipRequest(ctx, input)
}

// RejectFriendshipRequest is the resolver for the rejectFriendshipRequest field.
func (r *mutationResolver) RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.RejectFriendshipRequest(ctx, input)
}

// AddFriendByQRCode is the resolver for the addFriendByQRCode field.
func (r *mutationResolver) AddFriendByQRCode(ctx context.Context, input model.AddFriendByQRCode) (*model.Friendship, error) {
	friendshipService := services.NewFriendshipServiceWithSeparation(r.DB)
	return friendshipService.AddFriendByQRCode(ctx, input)
}
