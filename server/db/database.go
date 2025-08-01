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

	m := gormigrate.New(db, gormigrate.DefaultOptions, []*gormigrate.Migration{
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
				var count int64
				tx.Model(&entity.User{}).Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")).Count(&count)
				if count == 0 {
					adminUser := &entity.User{
						UID: os.Getenv("MOCK_ADMIN_UID"),
					}
					return tx.Create(adminUser).Error
				}
				return nil
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")).Delete(&entity.User{}).Error
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
			ID: "202507281403_create_workout_types",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.WorkoutType{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.WorkoutType{})
			},
		},
		{
			ID: "202507281404_create_workout_logs",
			Migrate: func(tx *gorm.DB) error {
				return tx.AutoMigrate(&entity.WorkoutLog{})
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Migrator().DropTable(&entity.WorkoutLog{})
			},
		},
		{
			ID: "202507281405_create_set_logs",
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
			ID: "202508021518_create_admin_user_2",
			Migrate: func(tx *gorm.DB) error {
				var count int64
				tx.Model(&entity.User{}).Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")+"-2").Count(&count)
				if count == 0 {
					adminUser := &entity.User{
						UID: os.Getenv("MOCK_ADMIN_UID") + "-2",
					}
					return tx.Create(adminUser).Error
				}
				return nil
			},
			Rollback: func(tx *gorm.DB) error {
				return tx.Where("uid = ?", os.Getenv("MOCK_ADMIN_UID")).Delete(&entity.User{}).Error
			},
		},
	})

	if err := m.Migrate(); err != nil {
		panic("Could not migrate: " + err.Error())
	}

	log.Printf("Migration did run successfully")
}
