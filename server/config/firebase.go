package config

import (
	"context"
	"fmt"
	"os"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

// FirebaseConfig holds Firebase configuration
type FirebaseConfig struct {
	ProjectID      string
	ServiceAccount string
}

// LoadFirebaseConfig loads Firebase configuration from environment variables
func LoadFirebaseConfig() *FirebaseConfig {
	serviceAccountPath := os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH")

	var serviceAccount string
	if serviceAccountPath != "" {
		// ファイルからサービスアカウントキーを読み込み
		if data, err := os.ReadFile(serviceAccountPath); err == nil {
			serviceAccount = string(data)
		}
	}

	return &FirebaseConfig{
		ProjectID:      os.Getenv("FIREBASE_PROJECT_ID"),
		ServiceAccount: serviceAccount,
	}
}

// NewFirebaseApp creates a new Firebase app instance
func NewFirebaseApp(ctx context.Context) (*firebase.App, error) {
	config := LoadFirebaseConfig()

	var opts []option.ClientOption

	if config.ServiceAccount != "" {
		// サービスアカウントキーをJSON文字列として読み込み
		opts = append(opts, option.WithCredentialsJSON([]byte(config.ServiceAccount)))
	} else {
		return nil, fmt.Errorf("FIREBASE_SERVICE_ACCOUNT_PATH environment variable is required")
	}

	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: config.ProjectID,
	}, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize firebase app: %w", err)
	}

	return app, nil
}
