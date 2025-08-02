package common

import (
	"app/entity"
	"app/middleware"
	"context"
	"fmt"

	"gorm.io/gorm"
)

type CommonRepository interface {
	GetCurrentUser(ctx context.Context) (*entity.User, error)
}

type commonRepository struct {
	db *gorm.DB
}

func NewCommonRepository(db *gorm.DB) CommonRepository {
	return &commonRepository{db: db}
}

func (r *commonRepository) GetCurrentUser(ctx context.Context) (*entity.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	var user entity.User
	if err := r.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return &user, nil
}
