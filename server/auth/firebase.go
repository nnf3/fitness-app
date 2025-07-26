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

func (fa *FirebaseAuth) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	idToken, found := strings.CutPrefix(idToken, "Bearer ")
	if !found {
		return nil, fmt.Errorf("invalid ID token")
	}

	token, err := fa.client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, fmt.Errorf("failed to verify ID token: %w", err)
	}

	return token, nil
}
