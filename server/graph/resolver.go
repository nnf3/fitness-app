package graph

import (
	"app/auth"
	"app/graph/services/common/loaders"
	"app/middleware"

	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB             *gorm.DB
	FirebaseAuth   *auth.FirebaseAuth
	AuthMiddleware *middleware.AuthMiddleware
	DataLoaders    *loaders.DataLoaders
}
