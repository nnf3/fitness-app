package common

import (
	"app/entity"
	"app/graph/model"
	"fmt"
	"time"
)

type CommonConverter struct{}

func NewCommonConverter() *CommonConverter {
	return &CommonConverter{}
}

func (c *CommonConverter) ToModelUser(user entity.User) *model.User {
	return &model.User{
		ID:        fmt.Sprintf("%d", user.ID),
		UID:       user.UID,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
		UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
	}
}

func (c *CommonConverter) ToModelUsers(users []entity.User) []*model.User {
	result := make([]*model.User, len(users))
	for i, user := range users {
		result[i] = c.ToModelUser(user)
	}
	return result
}

func (c *CommonConverter) ToModelUsersFromPointers(users []*entity.User) []*model.User {
	result := make([]*model.User, len(users))
	for i, user := range users {
		if user != nil {
			result[i] = c.ToModelUser(*user)
		}
	}
	return result
}
