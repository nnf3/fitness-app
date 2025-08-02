package entity

import (
	"fmt"
	"os"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UID         string       `gorm:"unique;not null"`
	WorkoutLogs []WorkoutLog `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// BeforeSave GORMフック - 保存前のバリデーション
func (u *User) BeforeSave(tx *gorm.DB) error {
	return u.Validate()
}

// BeforeCreate GORMフック - 作成前の処理
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if err := tx.Where("uid = ?", u.UID).First(&User{}).Error; err == nil {
		return fmt.Errorf("UIDはすでに存在します")
	}
	return u.Validate()
}

// BeforeUpdate GORMフック - 更新前の処理
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	return u.Validate()
}

// Validate カスタムバリデーション
func (u *User) Validate() error {
	if u.UID == "" {
		return fmt.Errorf("UIDは必須です")
	}
	return nil
}

func (u *User) IsAdmin() bool {
	return u.UID == os.Getenv("MOCK_ADMIN_UID")
}

func (u *User) GetFriendshipRequest(db *gorm.DB, friendshipID string) *Friendship {
	var request Friendship
	if err := db.Model(&Friendship{}).Where("id = ?", friendshipID).Where("requestee_id = ?", u.ID).Where("status = ?", Pending).First(&request).Error; err != nil {
		return nil
	}
	return &request
}

func (u *User) GetFriends(db *gorm.DB) []User {
	var friendships []Friendship
	if err := db.Model(&Friendship{}).
		Preload("Requester").
		Preload("Requestee").
		Where("requester_id = ? OR requestee_id = ?", u.ID, u.ID).
		Where("status = ?", Accepted).
		Find(&friendships).Error; err != nil {
		return nil
	}

	var friends []User
	for _, friendship := range friendships {
		if friendship.RequesterID == u.ID {
			friends = append(friends, friendship.Requestee)
		} else {
			friends = append(friends, friendship.Requester)
		}
	}

	return friends
}

func (u *User) GetFriendshipRequests(db *gorm.DB) []Friendship {
	var requests []Friendship
	if err := db.Model(&Friendship{}).Where("requestee_id = ?", u.ID).Where("status = ?", Pending).Find(&requests).Error; err != nil {
		return nil
	}
	return requests
}

func (u *User) GetRecommendedUsers(db *gorm.DB) []User {
	// 現在のユーザーと友達関係にあるユーザーIDを取得
	var excludeIDs []uint
	if err := db.Model(&Friendship{}).
		Select("CASE WHEN requester_id = ? THEN requestee_id ELSE requester_id END", u.ID).
		Where("requester_id = ? OR requestee_id = ?", u.ID, u.ID).
		Scan(&excludeIDs).Error; err != nil {
		return nil
	}

	// 現在のユーザーも除外リストに追加
	excludeIDs = append(excludeIDs, u.ID)

	var recommendedUsers []User
	if err := db.Model(&User{}).
		Where("id NOT IN ?", excludeIDs).
		Find(&recommendedUsers).Error; err != nil {
		return nil
	}

	return recommendedUsers
}
