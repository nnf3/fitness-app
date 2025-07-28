package entity

import (
	"fmt"
	"strings"
	"time"

	"app/graph/model"

	"gorm.io/gorm"
)

const (
	GenderMale   = "male"
	GenderFemale = "female"
	GenderOther  = "other"
)

var GenderEnum = []string{GenderMale, GenderFemale, GenderOther}

type Profile struct {
	gorm.Model
	UserID        uint `gorm:"not null;uniqueIndex"`
	User          User
	Name          string     `gorm:"not null;size:255"`
	BirthDate     *time.Time `gorm:"type:date"`
	Gender        string     `gorm:"type: enum('male', 'female', 'other')"`
	Height        *float64
	Weight        *float64
	ActivityLevel string `gorm:"type: enum('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')"`
	ImageURL      string
}

// GenderToGraphQL GraphQL enumに変換
func (p *Profile) GenderToGraphQL() *model.Gender {
	switch p.Gender {
	case "male":
		gender := model.GenderMale
		return &gender
	case "female":
		gender := model.GenderFemale
		return &gender
	case "other":
		gender := model.GenderOther
		return &gender
	case "prefer_not_to_say":
		gender := model.GenderPreferNotToSay
		return &gender
	default:
		return nil
	}
}

// ActivityLevelToGraphQL GraphQL enumに変換
func (p *Profile) ActivityLevelToGraphQL() *model.ActivityLevel {
	switch p.ActivityLevel {
	case "sedentary":
		level := model.ActivityLevelSedentary
		return &level
	case "lightly_active":
		level := model.ActivityLevelLightlyActive
		return &level
	case "moderately_active":
		level := model.ActivityLevelModeratelyActive
		return &level
	case "very_active":
		level := model.ActivityLevelVeryActive
		return &level
	case "extremely_active":
		level := model.ActivityLevelExtremelyActive
		return &level
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

	if p.Gender != "" {
		isValid := false
		for _, gender := range GenderEnum {
			if p.Gender == gender {
				isValid = true
				break
			}
		}
		if !isValid {
			return fmt.Errorf("性別は %s, %s, %s のいずれかを選択してください", GenderMale, GenderFemale, GenderOther)
		}
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

	if p.ActivityLevel != "" {
		validLevels := []string{"sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"}
		isValid := false
		for _, level := range validLevels {
			if p.ActivityLevel == level {
				isValid = true
				break
			}
		}
		if !isValid {
			return fmt.Errorf("活動レベルは sedentary, lightly_active, moderately_active, very_active, extremely_active のいずれかを選択してください")
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
