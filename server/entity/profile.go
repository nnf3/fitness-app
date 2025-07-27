package entity

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Profile struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	UserID        uint       `gorm:"not null;uniqueIndex" json:"user_id"`
	User          User       `gorm:"foreignKey:UserID" json:"user"`
	Name          string     `gorm:"not null;size:255" json:"name"`
	BirthDate     *time.Time `gorm:"type:date" json:"birth_date"`
	Gender        string     `gorm:"size:10" json:"gender"`
	Height        *float64   `gorm:"type:decimal(5,2)" json:"height"`
	Weight        *float64   `gorm:"type:decimal(5,2)" json:"weight"`
	ActivityLevel string     `gorm:"size:20" json:"activity_level"`
	CreatedAt     time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}

// BeforeSave GORMフック - 保存前のバリデーション
func (p *Profile) BeforeSave(tx *gorm.DB) error {
	return p.Validate()
}

// BeforeCreate GORMフック - 作成前の処理
func (p *Profile) BeforeCreate(tx *gorm.DB) error {
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	return p.Validate()
}

// BeforeUpdate GORMフック - 更新前の処理
func (p *Profile) BeforeUpdate(tx *gorm.DB) error {
	p.UpdatedAt = time.Now()
	return p.Validate()
}

// Validate カスタムバリデーション
func (p *Profile) Validate() error {
	// 基本バリデーション
	if p.Name == "" {
		return fmt.Errorf("名前は必須です")
	}
	if len(p.Name) > 255 {
		return fmt.Errorf("名前は255文字以内で入力してください")
	}

	// 性別バリデーション
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

	// 身長バリデーション
	if p.Height != nil {
		if *p.Height < 50 || *p.Height > 300 {
			return fmt.Errorf("身長は50cm〜300cmの範囲で入力してください")
		}
	}

	// 体重バリデーション
	if p.Weight != nil {
		if *p.Weight < 20 || *p.Weight > 500 {
			return fmt.Errorf("体重は20kg〜500kgの範囲で入力してください")
		}
	}

	// 活動レベルバリデーション
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
