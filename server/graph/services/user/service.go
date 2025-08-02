package user

import (
	"app/entity"
	"app/graph/model"
	"app/graph/services/friendship/loaders"
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
}

type userService struct {
	repo       UserRepository
	converter  *UserConverter
	userLoader loaders.UserLoaderInterface
}

func NewUserService(repo UserRepository, converter *UserConverter) UserService {
	return &userService{
		repo:      repo,
		converter: converter,
	}
}

func NewUserServiceWithDataLoader(repo UserRepository, converter *UserConverter, userLoader loaders.UserLoaderInterface) UserService {
	return &userService{
		repo:       repo,
		converter:  converter,
		userLoader: userLoader,
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
	// DataLoaderが利用可能な場合はそれを使用
	if s.userLoader != nil {
		user, err := s.userLoader.LoadByID(ctx, userID)
		if err != nil {
			return nil, err
		}
		return s.converter.ToModelUser(*user), nil
	}

	// フォールバック: 直接リポジトリから取得
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
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
