package data

import (
	"app/entity"
	"fmt"
	"io/ioutil"
	"log"

	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

// InitialExercise YAMLから読み込む初期データの構造体
type InitialExercise struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
	Category    string `yaml:"category"`
}

// InitialExercises YAMLファイル全体の構造体
type InitialExercises struct {
	Exercises []InitialExercise `yaml:"exercises"`
}

// LoadInitialExercises YAMLファイルから初期データを読み込む
func LoadInitialExercises(filePath string) (*InitialExercises, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("YAMLファイルの読み込みに失敗: %w", err)
	}

	var exercises InitialExercises
	if err := yaml.Unmarshal(data, &exercises); err != nil {
		return nil, fmt.Errorf("YAMLのパースに失敗: %w", err)
	}

	return &exercises, nil
}

// SeedInitialExercises 初期データをデータベースに登録する
func SeedInitialExercises(db *gorm.DB, filePath string) error {
	initialData, err := LoadInitialExercises(filePath)
	if err != nil {
		return fmt.Errorf("初期データの読み込みに失敗: %w", err)
	}

	for _, ex := range initialData.Exercises {
		// 既に存在するかチェック
		var existingExercise entity.Exercise
		result := db.Where("name = ?", ex.Name).First(&existingExercise)

		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				// 存在しない場合は新規作成
				exercise := &entity.Exercise{
					Name:        ex.Name,
					Description: ex.Description,
					Category:    ex.Category,
				}

				if err := db.Create(exercise).Error; err != nil {
					return fmt.Errorf("種目 '%s' の登録に失敗: %w", ex.Name, err)
				}

				log.Printf("✅ 初期種目を登録しました: %s", ex.Name)
			} else {
				return fmt.Errorf("種目 '%s' の存在確認に失敗: %w", ex.Name, result.Error)
			}
		} else {
			log.Printf("ℹ️  種目 '%s' は既に存在します", ex.Name)
		}
	}

	log.Printf("✅ 初期種目の登録が完了しました")
	return nil
}

// RemoveInitialExercises 初期データをデータベースから削除する
func RemoveInitialExercises(db *gorm.DB, filePath string) error {
	initialData, err := LoadInitialExercises(filePath)
	if err != nil {
		return fmt.Errorf("初期データの読み込みに失敗: %w", err)
	}

	for _, ex := range initialData.Exercises {
		// 初期データの種目を物理削除
		result := db.Unscoped().Where("name = ?", ex.Name).Delete(&entity.Exercise{})
		if result.Error != nil {
			return fmt.Errorf("種目 '%s' の削除に失敗: %w", ex.Name, result.Error)
		}

		if result.RowsAffected > 0 {
			log.Printf("✅ 初期種目を物理削除しました: %s", ex.Name)
		} else {
			log.Printf("ℹ️  種目 '%s' は存在しませんでした", ex.Name)
		}
	}

	log.Printf("✅ 初期種目の削除が完了しました")
	return nil
}
