package user

import (
	"app/entity"
	"app/graph/model"
	"app/middleware"
	"context"
	"fmt"
)

type UserService interface {
	GetCurrentUser(ctx context.Context) (*entity.User, error)
	GetOrCreateUserByUID(ctx context.Context) (user *model.User, err error)
	GetUserByUID(ctx context.Context) (user *model.User, err error)
	GetUserByID(ctx context.Context, userID string) (*model.User, error)
	GetUsers(ctx context.Context) ([]*model.User, error)
	DeleteUser(ctx context.Context, input model.DeleteUser) (bool, error)
	// DataLoader使用メソッド
	GetUserByIDWithDataLoader(ctx context.Context, userID string) (*model.User, error)
}

type userService struct {
	repo       UserRepository
	converter  *UserConverter
	dataLoader *UserDataLoader // DataLoaderを統合
}

func NewUserService(repo UserRepository, converter *UserConverter, dataLoader *UserDataLoader) UserService {
	return &userService{
		repo:       repo,
		converter:  converter,
		dataLoader: dataLoader,
	}
}

func (s *userService) GetCurrentUser(ctx context.Context) (*entity.User, error) {
	return s.repo.GetCurrentUser(ctx)
}

func (s *userService) GetOrCreateUserByUID(ctx context.Context) (*model.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	// 既存ユーザーを取得
	user, err := s.repo.GetUserByUID(ctx, uid)
	if err != nil {
		// ユーザーがいなければ新規作成
		user = &entity.User{
			UID: uid,
		}
		if err := s.repo.CreateUser(ctx, user); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
	}

	return s.converter.ToModelUser(*user), nil
}

func (s *userService) GetUserByUID(ctx context.Context) (*model.User, error) {
	uid, err := middleware.GetUserUIDFromContext(ctx)
	if err != nil {
		return nil, fmt.Errorf("unauthorized: %w", err)
	}

	user, err := s.repo.GetUserByUID(ctx, uid)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}

	return s.converter.ToModelUser(*user), nil
}

func (s *userService) GetUserByID(ctx context.Context, userID string) (*model.User, error) {
	// DataLoaderを使用して遅延ローディング
	user, err := s.dataLoader.LoadByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID %s: %w", userID, err)
	}
	if user == nil {
		return nil, fmt.Errorf("user not found: %s", userID)
	}
	return s.converter.ToModelUser(*user), nil
}

func (s *userService) GetUsers(ctx context.Context) ([]*model.User, error) {
	users, err := s.repo.GetUsers(ctx)
	if err != nil {
		return nil, err
	}

	return s.converter.ToModelUsers(users), nil
}

func (s *userService) DeleteUser(ctx context.Context, input model.DeleteUser) (bool, error) {
	id := input.ID
	if err := s.repo.DeleteUser(ctx, id); err != nil {
		return false, err
	}

	return true, nil
}

// DataLoader使用メソッド
func (s *userService) GetUserByIDWithDataLoader(ctx context.Context, userID string) (*model.User, error) {
	// 既存のDataLoaderを使用
	entityUser, err := s.dataLoader.LoadByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if entityUser == nil {
		return nil, nil
	}
	return s.converter.ToModelUser(*entityUser), nil
}
