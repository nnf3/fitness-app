package friendship

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
	"fmt"
)

type FriendshipConverter struct {
	common *common.CommonConverter
}

func NewFriendshipConverter() *FriendshipConverter {
	return &FriendshipConverter{
		common: common.NewCommonConverter(),
	}
}

func (c *FriendshipConverter) ToModelFriendship(friendship entity.Friendship) *model.Friendship {
	return &model.Friendship{
		ID:          fmt.Sprintf("%d", friendship.ID),
		RequesterID: fmt.Sprintf("%d", friendship.RequesterID),
		RequesteeID: fmt.Sprintf("%d", friendship.RequesteeID),
		Status:      *friendship.StatusToGraphQL(),
	}
}

func (c *FriendshipConverter) ToModelFriendships(friendships []entity.Friendship) []*model.Friendship {
	result := make([]*model.Friendship, len(friendships))
	for i, friendship := range friendships {
		result[i] = c.ToModelFriendship(friendship)
	}
	return result
}

func (c *FriendshipConverter) ToModelFriendshipsFromPointers(friendships []*entity.Friendship) []*model.Friendship {
	result := make([]*model.Friendship, len(friendships))
	for i, friendship := range friendships {
		if friendship != nil {
			result[i] = c.ToModelFriendship(*friendship)
		}
	}
	return result
}

// User変換はCommonConverterを使用
func (c *FriendshipConverter) ToModelUser(user entity.User) *model.User {
	return c.common.ToModelUser(user)
}

func (c *FriendshipConverter) ToModelUsers(users []entity.User) []*model.User {
	return c.common.ToModelUsers(users)
}

func (c *FriendshipConverter) ToModelUsersFromPointers(users []*entity.User) []*model.User {
	return c.common.ToModelUsersFromPointers(users)
}
