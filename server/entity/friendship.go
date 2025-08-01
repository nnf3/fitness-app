package entity

import (
	"fmt"

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
	if f.RequesterID != 0 {
		return fmt.Errorf("申請者自体を変更することはできません")
	}

	if f.RequesteeID != 0 {
		return fmt.Errorf("被申請者自体を変更することはできません")
	}

	return f.Validate()
}

func (f *Friendship) Validate() error {
	if f.RequesterID == 0 || f.RequesteeID == 0 {
		return fmt.Errorf("申請者と被申請者が指定されていません")
	}

	if f.RequesterID == f.RequesteeID {
		return fmt.Errorf("申請者と被申請者が同じユーザーです")
	}

	return nil
}
