package db

import (
	"app/entity"
	"fmt"
	"log"
	"os"

	"github.com/go-gormigrate/gormigrate/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	var dsn string

	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		dsn = dbURL
	} else {
		// 個別の環境変数を使用
		host := os.Getenv("DB_HOST")
		user := os.Getenv("DB_USER")
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
			host, user, password, dbname)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("❌ データベース接続に失敗しました: " + err.Error())
	}

	DB = db
	log.Printf("✅ データベース接続が成功しました")
}

// RollbackTo 指定したマイグレーションIDまでロールバックする
func RollbackTo(migrationID string) error {
	if DB == nil {
		return fmt.Errorf("データベースが接続されていません")
	}

	m := gormigrate.New(DB, gormigrate.DefaultOptions, getMigrations())

	if err := m.RollbackTo(migrationID); err != nil {
		return fmt.Errorf("ロールバックに失敗しました: %w", err)
	}

	log.Printf("✅ マイグレーション '%s' までロールバックしました", migrationID)
	return nil
}

// RollbackLast 最後のマイグレーションをロールバックする
func RollbackLast() error {
	if DB == nil {
		return fmt.Errorf("データベースが接続されていません")
	}

	m := gormigrate.New(DB, gormigrate.DefaultOptions, getMigrations())

	if err := m.RollbackLast(); err != nil {
		return fmt.Errorf("最後のマイグレーションのロールバックに失敗しました: %w", err)
	}

	log.Printf("✅ 最後のマイグレーションをロールバックしました")
	return nil
}

// MigrateTo 指定したマイグレーションIDまでマイグレーションを実行する
func MigrateTo(migrationID string) error {
	if DB == nil {
		return fmt.Errorf("データベースが接続されていません")
	}

	m := gormigrate.New(DB, gormigrate.DefaultOptions, getMigrations())

	if err := m.MigrateTo(migrationID); err != nil {
		return fmt.Errorf("マイグレーションに失敗しました: %w", err)
	}

	log.Printf("✅ マイグレーション '%s' まで実行しました", migrationID)
	return nil
}

// RunMigrations マイグレーションを実行する（サーバー起動時には呼ばれない）
func RunMigrations() error {
	if DB == nil {
		return fmt.Errorf("データベースが接続されていません")
	}

	m := gormigrate.New(DB, gormigrate.DefaultOptions, getMigrations())

	if err := m.Migrate(); err != nil {
		return fmt.Errorf("マイグレーションに失敗しました: %w", err)
	}

	log.Printf("✅ マイグレーションが正常に実行されました")
	return nil
}

// getMigrations マイグレーションの定義を取得する
func getMigrations() []*gormigrate.Migration {
	return []*gormigrate.Migration{
		{
			ID: "202507281400_create_users",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.User{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.User{})
			},
		},
		{
			ID: "202507281401_create_profiles",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.Profile{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.Profile{})
			},
		},
		{
			ID: "202507281402_create_admin_user",
			Migrate: func(tx *gorm.DB) error {
				if os.Getenv("ENABLE_MOCK_AUTH") == "true" {
					var count int64
					tx.Model(&entity.User{}).Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")).Count(&count)
					if count == 0 {
						adminUser := &entity.User{
							UID: os.Getenv("MOCK_ADMIN_UID"),
						}
						return tx.Create(adminUser).Error
					}
					return nil
				}
				return nil
			},
			Rollback: func(tx *gorm.DB) error {
				if os.Getenv("ENABLE_MOCK_AUTH") == "true" {
					return tx.Unscoped().Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")).Delete(&entity.User{}).Error
				}
				return nil
			},
		},
		{
			ID: "202507281403_add_image_url_to_profiles",
			Migrate: func(tx *gorm.DB) error {
				if !tx.Migrator().HasColumn(&entity.Profile{}, "image_url") {
					return tx.Migrator().AddColumn(&entity.Profile{}, "image_url")
				}
				return nil
			},
			Rollback: func(tx *gorm.DB) error {
				if tx.Migrator().HasColumn(&entity.Profile{}, "image_url") {
					return tx.Migrator().DropColumn(&entity.Profile{}, "image_url")
				}
				return nil
			},
		},
		{
			ID: "202507281403_create_exercises",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.Exercise{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.Exercise{})
			},
		},
		{
			ID: "202507281404_create_workouts",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.Workout{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.Workout{})
			},
		},
		{
			ID: "202507281405_create_workout_exercises",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.WorkoutExercise{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.WorkoutExercise{})
			},
		},
		{
			ID: "202507281406_create_set_logs",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.SetLog{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.SetLog{})
			},
		},
		{
			ID: "202508021400_create_friendships",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.Friendship{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.Friendship{})
			},
		},
		{
			ID: "202508031100_create_workout_groups",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.WorkoutGroup{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.WorkoutGroup{})
			},
		},
		{
			ID: "202508031110_add_workout_group_id_to_workouts",
			Migrate: func(tx *gorm.DB) error {
				if !tx.Migrator().HasColumn(&entity.Workout{}, "WorkoutGroupID") {
					return tx.Migrator().AddColumn(&entity.Workout{}, "WorkoutGroupID")
				}
				return nil
			},
			Rollback: func(tx *gorm.DB) error {
				if tx.Migrator().HasColumn(&entity.Workout{}, "WorkoutGroupID") {
					return tx.Migrator().DropColumn(&entity.Workout{}, "WorkoutGroupID")
				}
				return nil
			},
		},
	}
}
