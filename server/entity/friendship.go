package entity

import (
	"fmt"

	"app/graph/model"

	"gorm.io/gorm"
)

type FriendshipStatus string

const (
	Pending  FriendshipStatus = "pending"
	Accepted FriendshipStatus = "accepted"
	Rejected FriendshipStatus = "rejected"
)

type Friendship struct {
	gorm.Model
	RequesterID uint `gorm:"not null;index:idx_requester_requestee"`
	Requester   User `gorm:"foreignKey:RequesterID"`
	RequesteeID uint `gorm:"not null;index:idx_requester_requestee"`
	Requestee   User `gorm:"foreignKey:RequesteeID"`
	Status      string
}

func (f *Friendship) BeforeCreate(tx *gorm.DB) error {
	f.Status = string(Pending)

	return f.Validate()
}

func (f *Friendship) BeforeUpdate(tx *gorm.DB) error {
	// 更新時は基本的なバリデーションのみ実行
	// IDの変更チェックはGORMの機能で自動的に行われる
	return f.Validate()
}

func (f *Friendship) Validate() error {
	if f.RequesterID == 0 || f.RequesteeID == 0 {
		return fmt.Errorf("申請者と被申請者が指定されていません")
	}

	if f.RequesterID == f.RequesteeID {
		return fmt.Errorf("申請者と被申請者が同じユーザーです")
	}

	// Statusのenumバリデーション
	if f.Status != "" && !f.IsValidStatus(f.Status) {
		return fmt.Errorf("無効なステータスです: %s", f.Status)
	}

	return nil
}

// IsValidStatus は指定されたステータスが有効かどうかをチェックします
func (f *Friendship) IsValidStatus(status string) bool {
	validStatuses := f.GetValidStatuses()

	for _, validStatus := range validStatuses {
		if status == validStatus {
			return true
		}
	}
	return false
}

// GetValidStatuses は有効なステータスのリストを返します
func (f *Friendship) GetValidStatuses() []string {
	return []string{
		string(Pending),
		string(Accepted),
		string(Rejected),
	}
}

func (f *Friendship) StatusToGraphQL() *model.FriendshipStatus {
	switch f.Status {
	case string(Pending):
		friendshipStatus := model.FriendshipStatusPending
		return &friendshipStatus
	case string(Accepted):
		friendshipStatus := model.FriendshipStatusAccepted
		return &friendshipStatus
	case string(Rejected):
		friendshipStatus := model.FriendshipStatusRejected
		return &friendshipStatus
	default:
		return nil
	}
}
