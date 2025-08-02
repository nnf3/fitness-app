package user

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/common"
)

type UserConverter struct {
	common *common.CommonConverter
}

func NewUserConverter() *UserConverter {
	return &UserConverter{
		common: common.NewCommonConverter(),
	}
}

func (c *UserConverter) ToModelUser(user entity.User) *model.User {
	return c.common.ToModelUser(user)
}

func (c *UserConverter) ToModelUsers(users []entity.User) []*model.User {
	return c.common.ToModelUsers(users)
}

func (c *UserConverter) ToModelUsersFromPointers(users []*entity.User) []*model.User {
	return c.common.ToModelUsersFromPointers(users)
}
