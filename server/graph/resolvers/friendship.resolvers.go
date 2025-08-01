package resolvers

import (
	"app/graph/model"
	"app/graph/services"
	"context"
)

// =============================================================================
// FriendshipResolver
// =============================================================================

// Requester is the resolver for the requester field.
func (r *friendshipResolver) Requester(ctx context.Context, obj *model.Friendship) (*model.User, error) {
	friendshipService := services.NewFriendshipService(r.DB, r.DataLoaders.FriendshipLoader)
	requesterID, err := friendshipService.GetFriendshipRequesterID(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	userService := services.NewUserService(r.DB)
	return userService.GetUserByID(ctx, requesterID)
}

// Requestee is the resolver for the requestee field.
func (r *friendshipResolver) Requestee(ctx context.Context, obj *model.Friendship) (*model.User, error) {
	friendshipService := services.NewFriendshipService(r.DB, r.DataLoaders.FriendshipLoader)
	requesteeID, err := friendshipService.GetFriendshipRequesteeID(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	userService := services.NewUserService(r.DB)
	return userService.GetUserByID(ctx, requesteeID)
}
