package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Profile struct {
	gorm.Model
	UserID        uint `gorm:"not null;uniqueIndex"`
	User          User
	Name          string     `gorm:"not null;size:255"`
	BirthDate     *time.Time `gorm:"type:date"`
	Gender        string     `gorm:"size:10"`
	Height        *float64
	Weight        *float64
	ActivityLevel string
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
		validGenders := []string{"male", "female", "other", "prefer_not_to_say"}
		isValid := false
		for _, gender := range validGenders {
			if p.Gender == gender {
				isValid = true
				break
			}
		}
		if !isValid {
			return fmt.Errorf("性別は male, female, other, prefer_not_to_say のいずれかを選択してください")
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

	return nil
}

// IsOnboardingCompleted オンボーディング完了判定
func (p *Profile) IsOnboardingCompleted() bool {
	return p.BirthDate != nil && p.Gender != "" && p.ActivityLevel != ""
}
