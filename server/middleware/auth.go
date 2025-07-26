package middleware

import (
	"context"
	"fmt"
	"net/http"

	"app/auth"

	firebaseAuth "firebase.google.com/go/v4/auth"
)

type AuthMiddleware struct {
	firebaseAuth *auth.FirebaseAuth
}

func NewAuthMiddleware(firebaseAuth *auth.FirebaseAuth) *AuthMiddleware {
	return &AuthMiddleware{
		firebaseAuth: firebaseAuth,
	}
}

// AuthContextKey is the key used to store user info in context
type AuthContextKey string

const (
	UserContextKey AuthContextKey = "user"
)

// AuthMiddleware extracts JWT from Authorization header and verifies it
func (am *AuthMiddleware) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// GraphQLのPOSTリクエストのみを処理
		if r.Method != "POST" {
			next.ServeHTTP(w, r)
			return
		}

		// Authorization headerからJWTを取得
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// JWTがない場合は匿名ユーザーとして処理
			next.ServeHTTP(w, r)
			return
		}

		// JWTを検証
		token, err := am.firebaseAuth.VerifyIDToken(r.Context(), authHeader)
		if err != nil {
			// JWTが無効な場合は匿名ユーザーとして処理
			// 本番環境では適切なエラーレスポンスを返す
			next.ServeHTTP(w, r)
			return
		}

		// コンテキストにユーザー情報を保存
		ctx := context.WithValue(r.Context(), UserContextKey, token)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext extracts user info from context
func GetUserFromContext(ctx context.Context) (*firebaseAuth.Token, error) {
	user, ok := ctx.Value(UserContextKey).(*firebaseAuth.Token)
	if !ok {
		return nil, fmt.Errorf("user not found in context")
	}
	return user, nil
}

// GetUserUIDFromContext extracts user UID from context
func GetUserUIDFromContext(ctx context.Context) (string, error) {
	user, err := GetUserFromContext(ctx)
	if err != nil {
		return "", err
	}
	return user.UID, nil
}
