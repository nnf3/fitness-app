package dataloader

import (
	"app/entity"
	"context"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

// ContextKey is the key type for context values
type ContextKey string

const (
	// ProfileLoaderContextKey is the context key for profile loader
	ProfileLoaderContextKey ContextKey = "profileLoader"
)

// DataLoaders holds all data loaders
type DataLoaders struct {
	ProfileLoader *dataloader.Loader[ProfileLoaderKey, *entity.Profile]
}

// NewDataLoaders creates new data loaders
func NewDataLoaders(db *gorm.DB) *DataLoaders {
	return &DataLoaders{
		ProfileLoader: NewProfileLoader(db),
	}
}

// GetProfileLoader returns the profile loader from context
func GetProfileLoader(ctx context.Context) *dataloader.Loader[ProfileLoaderKey, *entity.Profile] {
	if loaders, ok := ctx.Value(DataLoadersContextKey).(*DataLoaders); ok && loaders != nil {
		return loaders.ProfileLoader
	}
	return nil
}

// DataLoadersContextKey is the context key for data loaders
const DataLoadersContextKey ContextKey = "dataLoaders"

// WithDataLoaders adds data loaders to the context
func WithDataLoaders(ctx context.Context, db *gorm.DB) context.Context {
	loaders := NewDataLoaders(db)
	return context.WithValue(ctx, DataLoadersContextKey, loaders)
}
