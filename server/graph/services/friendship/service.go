package friendship

import (
	"app/entity"
	"app/graph/dataloader"
	"app/graph/model"
	"app/graph/services/common"
	"app/graph/services/user"
	"context"
	"fmt"
	"strconv"
)

type FriendshipService interface {
	GetFriends(ctx context.Context, userID string) ([]*model.User, error)
	GetFriendshipRequests(ctx context.Context, userID string) ([]*model.Friendship, error)
	GetRecommendedUsers(ctx context.Context, userID string) ([]*model.User, error)
	GetFriendshipByID(ctx context.Context, friendshipID string) (*model.Friendship, error)
	GetFriendshipRequester(ctx context.Context, friendshipID string) (*model.User, error)
	GetFriendshipRequestee(ctx context.Context, friendshipID string) (*model.User, error)
	SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error)
	AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error)
	RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error)
}

type friendshipService struct {
	repo       FriendshipRepository
	userRepo   user.UserRepository
	converter  *FriendshipConverter
	loader     dataloader.FriendshipLoaderInterface
	userLoader dataloader.UserLoaderInterface
	common     common.CommonRepository
}

func NewFriendshipService(repo FriendshipRepository, converter *FriendshipConverter, loader dataloader.FriendshipLoaderInterface) FriendshipService {
	return &friendshipService{
		repo:      repo,
		converter: converter,
		loader:    loader,
		common:    common.NewCommonRepository(repo.GetDB()),
	}
}

func NewFriendshipServiceWithUserLoader(repo FriendshipRepository, userRepo user.UserRepository, converter *FriendshipConverter, loader dataloader.FriendshipLoaderInterface, userLoader dataloader.UserLoaderInterface) FriendshipService {
	return &friendshipService{
		repo:       repo,
		userRepo:   userRepo,
		converter:  converter,
		loader:     loader,
		userLoader: userLoader,
		common:     common.NewCommonRepository(repo.GetDB()),
	}
}

func (s *friendshipService) GetFriendshipByID(ctx context.Context, friendshipID string) (*model.Friendship, error) {
	friendship, err := s.repo.GetFriendshipByID(ctx, friendshipID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelFriendship(*friendship), nil
}

func (s *friendshipService) GetFriendshipRequesterID(ctx context.Context, friendshipID string) (string, error) {
	friendship, err := s.repo.GetFriendshipByID(ctx, friendshipID)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%d", friendship.RequesterID), nil
}

func (s *friendshipService) GetFriendshipRequesteeID(ctx context.Context, friendshipID string) (string, error) {
	friendship, err := s.repo.GetFriendshipByID(ctx, friendshipID)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%d", friendship.RequesteeID), nil
}

func (s *friendshipService) GetFriends(ctx context.Context, userID string) ([]*model.User, error) {
	friends, err := s.repo.GetFriendsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelUsersFromPointers(friends), nil
}

func (s *friendshipService) GetFriendshipRequests(ctx context.Context, userID string) ([]*model.Friendship, error) {
	requests, err := s.repo.GetFriendshipRequestsByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelFriendshipsFromPointers(requests), nil
}

func (s *friendshipService) GetRecommendedUsers(ctx context.Context, userID string) ([]*model.User, error) {
	users, err := s.repo.GetRecommendedUsersByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelUsersFromPointers(users), nil
}

func (s *friendshipService) SendFriendshipRequest(ctx context.Context, input model.SendFriendshipRequest) (*model.Friendship, error) {
	// 現在のユーザーを取得
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	requesteeID, err := strconv.ParseUint(input.RequesteeID, 10, 32)
	if err != nil {
		return nil, fmt.Errorf("invalid requestee ID: %s", input.RequesteeID)
	}

	friendship := entity.Friendship{
		RequesterID: currentUser.ID,
		RequesteeID: uint(requesteeID),
		Status:      string(entity.Pending),
	}

	if err := s.repo.CreateFriendship(ctx, &friendship); err != nil {
		return nil, fmt.Errorf("failed to create friendship: %w", err)
	}

	return s.converter.ToModelFriendship(friendship), nil
}

func (s *friendshipService) AcceptFriendshipRequest(ctx context.Context, input model.AcceptFriendshipRequest) (*model.Friendship, error) {
	// 現在のユーザーを取得
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	// 友達リクエストを取得
	friendRequest, err := s.getFriendshipRequest(ctx, currentUser, input.FriendshipID)
	if err != nil {
		return nil, err
	}

	// ステータスをAcceptedに更新
	friendRequest.Status = string(entity.Accepted)
	if err := s.repo.UpdateFriendship(ctx, friendRequest); err != nil {
		return nil, fmt.Errorf("failed to update friendship: %w", err)
	}

	return s.converter.ToModelFriendship(*friendRequest), nil
}

func (s *friendshipService) RejectFriendshipRequest(ctx context.Context, input model.RejectFriendshipRequest) (*model.Friendship, error) {
	// 現在のユーザーを取得
	currentUser, err := s.common.GetCurrentUser(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get current user: %w", err)
	}

	// 友達リクエストを取得
	friendRequest, err := s.getFriendshipRequest(ctx, currentUser, input.FriendshipID)
	if err != nil {
		return nil, err
	}

	// ステータスをRejectedに更新
	friendRequest.Status = string(entity.Rejected)
	if err := s.repo.UpdateFriendship(ctx, friendRequest); err != nil {
		return nil, fmt.Errorf("failed to update friendship: %w", err)
	}

	return s.converter.ToModelFriendship(*friendRequest), nil
}

func (s *friendshipService) GetFriendshipRequester(ctx context.Context, friendshipID string) (*model.User, error) {
	// まずFriendshipのRequesterIDを取得
	requesterID, err := s.GetFriendshipRequesterID(ctx, friendshipID)
	if err != nil {
		return nil, err
	}

	// UserLoaderが利用可能な場合はそれを使用
	if s.userLoader != nil {
		userEntity, err := s.userLoader.LoadUser(ctx, requesterID)
		if err != nil {
			return nil, err
		}
		return s.converter.ToModelUser(*userEntity), nil
	}

	// フォールバック: UserRepositoryから取得
	user, err := s.userRepo.GetUserByID(ctx, requesterID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelUser(*user), nil
}

func (s *friendshipService) GetFriendshipRequestee(ctx context.Context, friendshipID string) (*model.User, error) {
	// まずFriendshipのRequesteeIDを取得
	requesteeID, err := s.GetFriendshipRequesteeID(ctx, friendshipID)
	if err != nil {
		return nil, err
	}

	// UserLoaderが利用可能な場合はそれを使用
	if s.userLoader != nil {
		userEntity, err := s.userLoader.LoadUser(ctx, requesteeID)
		if err != nil {
			return nil, err
		}
		return s.converter.ToModelUser(*userEntity), nil
	}

	// フォールバック: UserRepositoryから取得
	user, err := s.userRepo.GetUserByID(ctx, requesteeID)
	if err != nil {
		return nil, err
	}
	return s.converter.ToModelUser(*user), nil
}

// ヘルパー関数
func (s *friendshipService) getFriendshipRequest(ctx context.Context, currentUser *entity.User, friendshipID string) (*entity.Friendship, error) {
	request := currentUser.GetFriendshipRequest(s.repo.GetDB(), friendshipID)
	if request == nil {
		return nil, fmt.Errorf("friendship request not found")
	}
	return request, nil
}
