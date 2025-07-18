package entity

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// 名前が空でないか
func (u *User) IsNameValid() bool {
	return u.Name != ""
}

// 作成日時が空でなく、現在時刻よりも前であるか
func (u *User) IsCreatedAtValid() bool {
	return !u.CreatedAt.IsZero() && u.CreatedAt.Before(time.Now())
}

// 更新日時が空でなく、現在時刻よりも前であるか
func (u *User) IsUpdatedAtValid() bool {
	return !u.UpdatedAt.IsZero() && u.UpdatedAt.Before(time.Now())
}

// バリデーションを1つに集約
func (u *User) Validate() map[string]string {
	errors := make(map[string]string)
	if !u.IsNameValid() {
		errors["name"] = "名前は必須です"
	}
	if !u.IsCreatedAtValid() {
		errors["created_at"] = "作成日時は必須です"
	}
	if !u.IsUpdatedAtValid() {
		errors["updated_at"] = "更新日時は必須です"
	}
	return errors
}
