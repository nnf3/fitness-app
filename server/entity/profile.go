package entity

import (
	"fmt"
	"strings"
	"time"

	"app/graph/model"

	"gorm.io/gorm"
)

type Gender string
type ActivityLevel string

const (
	Male   Gender = "male"
	Female Gender = "female"
	Other  Gender = "other"
)

const (
	Sedentary        ActivityLevel = "sedentary"
	LightlyActive    ActivityLevel = "lightly_active"
	ModeratelyActive ActivityLevel = "moderately_active"
	VeryActive       ActivityLevel = "very_active"
	ExtremelyActive  ActivityLevel = "extremely_active"
)

type Profile struct {
	gorm.Model
	UserID        uint       `gorm:"not null;uniqueIndex"`
	Name          string     `gorm:"not null;size:255"`
	BirthDate     *time.Time `gorm:"type:date"`
	Gender        Gender
	Height        *float64
	Weight        *float64
	ActivityLevel ActivityLevel
	ImageURL      string

	User User `gorm:"constraint:OnDelete:CASCADE;foreignKey:UserID"`
}

// GenderToGraphQL GraphQL enumに変換
func (p *Profile) GenderToGraphQL() *model.Gender {
	switch p.Gender {
	case Male:
		gender := model.GenderMale
		return &gender
	case Female:
		gender := model.GenderFemale
		return &gender
	case Other:
		gender := model.GenderOther
		return &gender
	default:
		return nil
	}
}

// ActivityLevelToGraphQL GraphQL enumに変換
func (p *Profile) ActivityLevelToGraphQL() *model.ActivityLevel {
	switch p.ActivityLevel {
	case Sedentary:
		activityLevel := model.ActivityLevelSedentary
		return &activityLevel
	case LightlyActive:
		activityLevel := model.ActivityLevelLightlyActive
		return &activityLevel
	case ModeratelyActive:
		activityLevel := model.ActivityLevelModeratelyActive
		return &activityLevel
	case VeryActive:
		activityLevel := model.ActivityLevelVeryActive
		return &activityLevel
	case ExtremelyActive:
		activityLevel := model.ActivityLevelExtremelyActive
		return &activityLevel
	default:
		return nil
	}
}

// GenderFromGraphQL GraphQL enumから変換
func (p *Profile) GenderFromGraphQL(gender *model.Gender) {
	if gender == nil {
		p.Gender = ""
		return
	}

	switch *gender {
	case model.GenderMale:
		p.Gender = "male"
	case model.GenderFemale:
		p.Gender = "female"
	case model.GenderOther:
		p.Gender = "other"
	}
}

// ActivityLevelFromGraphQL GraphQL enumから変換
func (p *Profile) ActivityLevelFromGraphQL(level *model.ActivityLevel) {
	if level == nil {
		p.ActivityLevel = ""
		return
	}

	switch *level {
	case model.ActivityLevelSedentary:
		p.ActivityLevel = "sedentary"
	case model.ActivityLevelLightlyActive:
		p.ActivityLevel = "lightly_active"
	case model.ActivityLevelModeratelyActive:
		p.ActivityLevel = "moderately_active"
	case model.ActivityLevelVeryActive:
		p.ActivityLevel = "very_active"
	case model.ActivityLevelExtremelyActive:
		p.ActivityLevel = "extremely_active"
	}
}

// BeforeSave GORMフック - 保存前のバリデーション
func (p *Profile) BeforeSave(tx *gorm.DB) error {
	return p.Validate()
}

// BeforeCreate GORMフック - 作成前の処理
func (p *Profile) BeforeCreate(tx *gorm.DB) error {
	// DBに同じユーザーIDが存在しないことを確認
	if err := tx.Where("user_id = ?", p.UserID).First(&Profile{}).Error; err == nil {
		return fmt.Errorf("ユーザーIDはすでに存在します")
	}

	return p.Validate()
}

// BeforeUpdate GORMフック - 更新前の処理
func (p *Profile) BeforeUpdate(tx *gorm.DB) error {
	return p.Validate()
}

// Validate カスタムバリデーション
func (p *Profile) Validate() error {
	if p.Name == "" {
		return fmt.Errorf("名前は必須です")
	}
	if len(p.Name) > 255 {
		return fmt.Errorf("名前は255文字以内で入力してください")
	}

	if p.Height != nil {
		if *p.Height < 50 || *p.Height > 300 {
			return fmt.Errorf("身長は50cm〜300cmの範囲で入力してください")
		}
	}

	if p.Weight != nil {
		if *p.Weight < 20 || *p.Weight > 500 {
			return fmt.Errorf("体重は20kg〜500kgの範囲で入力してください")
		}
	}

	if p.ImageURL != "" {
		if !strings.HasPrefix(p.ImageURL, "https://") {
			return fmt.Errorf("画像URLはhttpsから始まる必要があります")
		}
	}

	return nil
}

// IsOnboardingCompleted オンボーディング完了判定
func (p *Profile) IsOnboardingCompleted() bool {
	return p.BirthDate != nil && p.Gender != "" && p.ActivityLevel != ""
}
