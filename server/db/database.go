package db

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

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

	// ログレベルを環境変数から取得
	logLevel := getLogLevel()

	// GORM設定（SQLログ出力を含む）
	config := &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
			logger.Config{
				SlowThreshold:             time.Second, // Slow SQL threshold
				LogLevel:                  logLevel,    // Log level
				IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
				ParameterizedQueries:      false,       // Don't include params in the SQL log
				Colorful:                  true,        // Enable color
			},
		),
	}

	database, err := gorm.Open(postgres.Open(dsn), config)
	if err != nil {
		panic("❌ データベース接続に失敗しました: " + err.Error())
	}

	DB = database
	log.Printf("✅ データベース接続が成功しました")
}

// getLogLevel returns the log level from environment variable
func getLogLevel() logger.LogLevel {
	logLevelStr := os.Getenv("GORM_LOG_LEVEL")
	if logLevelStr == "" {
		logLevelStr = "info" // デフォルトはinfo
	}

	switch strings.ToLower(logLevelStr) {
	case "silent":
		return logger.Silent
	case "error":
		return logger.Error
	case "warn":
		return logger.Warn
	case "info":
		return logger.Info
	default:
		return logger.Info
	}
}
