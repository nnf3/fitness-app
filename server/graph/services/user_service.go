package services

import (
	"app/entity"
	"app/graph/model"
	"app/middleware"
	"context"
	"fmt"
	"strconv"
	"time"

	"gorm.io/gorm"
)

type UserService interface {
	GetCurrentUser(ctx context.Context) (*entity.User, error)
	GetOrCreateUserByUID(ctx context.Context) (user *model.User, err error)
	GetUserByUID(ctx context.Context) (user *model.User, err error)
	GetUserByID(ctx context.Context, userID string) (*model.User, error)
	GetUsers(ctx context.Context) ([]*model.User, error)
}

type userService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) UserService {
	return &userService{db: db}
}

func (u *userService) GetCurrentUser(ctx context.Context) (*entity.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user := entity.User{}
	if err := u.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return &user, nil
}

func convertUser(user entity.User) *model.User {
	return &model.User{
		ID:        fmt.Sprintf("%d", user.ID),
		UID:       user.UID,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
		UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
	}
}

func (u *userService) GetOrCreateUserByUID(ctx context.Context) (*model.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user := entity.User{}
	if err := u.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		// ユーザーがいなければ新規作成
		user = entity.User{
			UID: uid,
		}
		if err := u.db.Create(&user).Error; err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	}

	return convertUser(user), nil
}

func (u *userService) GetUserByUID(ctx context.Context) (*model.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user := entity.User{}
	if err := u.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return convertUser(user), nil
}

func (u *userService) GetUsers(ctx context.Context) ([]*model.User, error) {
	users := []entity.User{}
	if err := u.db.Find(&users).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	convertedUsers := make([]*model.User, len(users))
	for i, user := range users {
		convertedUsers[i] = convertUser(user)
	}

	return convertedUsers, nil
}

func (u *userService) GetUserByID(ctx context.Context, userID string) (*model.User, error) {
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %s", userID)
	}

	user := entity.User{}
	if err := u.db.Where("id = ?", uint(id)).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return convertUser(user), nil
}
