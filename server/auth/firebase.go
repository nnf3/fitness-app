package auth

import (
	"context"
	"fmt"
	"strings"

	"app/config"

	"firebase.google.com/go/v4/auth"
)

type FirebaseAuth struct {
	client *auth.Client
}

// NewFirebaseAuth creates a new Firebase Auth instance
func NewFirebaseAuth(ctx context.Context) (*FirebaseAuth, error) {
	// Firebase Admin SDKの初期化
	app, err := config.NewFirebaseApp(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize firebase app: %w", err)
	}

	client, err := app.Auth(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get firebase auth client: %w", err)
	}

	return &FirebaseAuth{
		client: client,
	}, nil
}

// VerifyIDToken verifies the Firebase ID token and returns the user info
func (fa *FirebaseAuth) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	// Bearer tokenからID tokenを抽出
	if strings.HasPrefix(idToken, "Bearer ") {
		idToken = strings.TrimPrefix(idToken, "Bearer ")
	}

	token, err := fa.client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, fmt.Errorf("failed to verify ID token: %w", err)
	}

	return token, nil
}

// GetUserByUID gets user information from Firebase by UID
func (fa *FirebaseAuth) GetUserByUID(ctx context.Context, uid string) (*auth.UserRecord, error) {
	user, err := fa.client.GetUser(ctx, uid)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by UID: %w", err)
	}

	return user, nil
}

// CreateUser creates a new user in Firebase
func (fa *FirebaseAuth) CreateUser(ctx context.Context, email, password string) (*auth.UserRecord, error) {
	params := (&auth.UserToCreate{}).
		Email(email).
		Password(password)

	user, err := fa.client.CreateUser(ctx, params)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}
