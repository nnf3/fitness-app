package data

import (
	"app/entity"
	"fmt"
	"io/ioutil"
	"log"

	"gopkg.in/yaml.v3"
	"gorm.io/gorm"
)

// InitialWorkoutType YAMLから読み込む初期データの構造体
type InitialWorkoutType struct {
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
	Category    string `yaml:"category"`
}

// InitialWorkoutTypes YAMLファイル全体の構造体
type InitialWorkoutTypes struct {
	WorkoutTypes []InitialWorkoutType `yaml:"workout_types"`
}

// LoadInitialWorkoutTypes YAMLファイルから初期データを読み込む
func LoadInitialWorkoutTypes(filePath string) (*InitialWorkoutTypes, error) {
	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("YAMLファイルの読み込みに失敗: %w", err)
	}

	var workoutTypes InitialWorkoutTypes
	if err := yaml.Unmarshal(data, &workoutTypes); err != nil {
		return nil, fmt.Errorf("YAMLのパースに失敗: %w", err)
	}

	return &workoutTypes, nil
}

// SeedInitialWorkoutTypes 初期データをデータベースに登録する
func SeedInitialWorkoutTypes(db *gorm.DB, filePath string) error {
	initialData, err := LoadInitialWorkoutTypes(filePath)
	if err != nil {
		return fmt.Errorf("初期データの読み込みに失敗: %w", err)
	}

	for _, wt := range initialData.WorkoutTypes {
		// 既に存在するかチェック
		var existingWorkoutType entity.WorkoutType
		result := db.Where("name = ?", wt.Name).First(&existingWorkoutType)

		if result.Error != nil {
			if result.Error == gorm.ErrRecordNotFound {
				// 存在しない場合は新規作成
				workoutType := &entity.WorkoutType{
					Name:        wt.Name,
					Description: wt.Description,
					Category:    wt.Category,
				}

				if err := db.Create(workoutType).Error; err != nil {
					return fmt.Errorf("種目 '%s' の登録に失敗: %w", wt.Name, err)
				}

				log.Printf("✅ 初期種目を登録しました: %s", wt.Name)
			} else {
				return fmt.Errorf("種目 '%s' の存在確認に失敗: %w", wt.Name, result.Error)
			}
		} else {
			log.Printf("ℹ️  種目 '%s' は既に存在します", wt.Name)
		}
	}

	log.Printf("✅ 初期種目の登録が完了しました")
	return nil
}

// RemoveInitialWorkoutTypes 初期データをデータベースから削除する
func RemoveInitialWorkoutTypes(db *gorm.DB, filePath string) error {
	initialData, err := LoadInitialWorkoutTypes(filePath)
	if err != nil {
		return fmt.Errorf("初期データの読み込みに失敗: %w", err)
	}

	for _, wt := range initialData.WorkoutTypes {
		// 初期データの種目を物理削除
		result := db.Unscoped().Where("name = ?", wt.Name).Delete(&entity.WorkoutType{})
		if result.Error != nil {
			return fmt.Errorf("種目 '%s' の削除に失敗: %w", wt.Name, result.Error)
		}

		if result.RowsAffected > 0 {
			log.Printf("✅ 初期種目を物理削除しました: %s", wt.Name)
		} else {
			log.Printf("ℹ️  種目 '%s' は存在しませんでした", wt.Name)
		}
	}

	log.Printf("✅ 初期種目の削除が完了しました")
	return nil
}
