package dataloader

import (
	"context"

	"gorm.io/gorm"
)

type ContextKey string

const (
	ProfileLoaderContextKey ContextKey = "profileLoader"
)

type DataLoaders struct {
	ProfileLoader ProfileLoaderInterface
}

func NewDataLoaders(db *gorm.DB) *DataLoaders {
	return &DataLoaders{
		ProfileLoader: NewProfileLoader(db),
	}
}

const DataLoadersContextKey ContextKey = "dataLoaders"

func WithDataLoaders(ctx context.Context, db *gorm.DB) context.Context {
	loaders := NewDataLoaders(db)
	return context.WithValue(ctx, DataLoadersContextKey, loaders)
}
