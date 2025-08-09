package user

import (
	"app/entity"
	"app/middleware"
	"context"
	"fmt"
	"strconv"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetCurrentUser(ctx context.Context) (*entity.User, error)
	GetUserByUID(ctx context.Context, uid string) (*entity.User, error)
	GetUserByID(ctx context.Context, userID string) (*entity.User, error)
	GetUsers(ctx context.Context) ([]entity.User, error)
	CreateUser(ctx context.Context, user *entity.User) error
	DeleteUser(ctx context.Context, id string) error

	// バッチ取得メソッド（DataLoader用）
	GetUsersByIDs(userIDs []uint) ([]*entity.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetCurrentUser(ctx context.Context) (*entity.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user := entity.User{}
	if err := r.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return &user, nil
}

func (r *userRepository) GetUserByUID(ctx context.Context, uid string) (*entity.User, error) {
	user := entity.User{}
	if err := r.db.Where("uid = ?", uid).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return &user, nil
}

func (r *userRepository) GetUserByID(ctx context.Context, userID string) (*entity.User, error) {
	id, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %s", userID)
	}

	user := entity.User{}
	if err := r.db.Where("id = ?", uint(id)).First(&user).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return &user, nil
}

func (r *userRepository) GetUsers(ctx context.Context) ([]entity.User, error) {
	users := []entity.User{}
	if err := r.db.Find(&users).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	return users, nil
}

func (r *userRepository) CreateUser(ctx context.Context, user *entity.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) DeleteUser(ctx context.Context, id string) error {
	user := entity.User{}
	if err := r.db.First(&user, id).Error; err != nil {
		return fmt.Errorf("failed to fetch user: %w", err)
	}

	return r.db.Delete(&user).Error
}

// GetUsersByIDs はバッチでUserIDsからUsersを取得
func (r *userRepository) GetUsersByIDs(userIDs []uint) ([]*entity.User, error) {
	if len(userIDs) == 0 {
		return []*entity.User{}, nil
	}

	var users []entity.User
	if err := r.db.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch users by IDs: %w", err)
	}

	// ポインタスライスに変換
	result := make([]*entity.User, len(users))
	for i := range users {
		result[i] = &users[i]
	}
	return result, nil
}
