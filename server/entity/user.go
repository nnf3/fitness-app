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

func (u *User) GetFriends() []User {
	var friends []User
	db := gorm.DB{}
	db.Model(&Friendship{}).Where("requester_id = ? OR requestee_id = ?", u.ID, u.ID).Where("status = ?", Accepted).Find(&friends)
	return friends
}

func (u *User) GetFriendshipRequest(friendshipID string) *Friendship {
	var request *Friendship
	db := gorm.DB{}
	db.Model(&Friendship{}).Where("id = ?", friendshipID).Where("requestee_id = ?", u.ID).Where("status = ?", Pending).Find(&request)
	return request
}
