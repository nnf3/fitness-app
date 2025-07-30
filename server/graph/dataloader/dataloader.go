package dataloader

import (
	"context"

	"gorm.io/gorm"
)

type ContextKey string

const (
	ProfileLoaderContextKey ContextKey = "profileLoader"
	WorkoutLogsLoaderContextKey ContextKey = "workoutLogsLoader"
	SetLogsLoaderContextKey     ContextKey = "setLogsLoader"
	WorkoutTypesLoaderContextKey ContextKey = "workoutTypesLoader"
)

type DataLoaders struct {
	ProfileLoader ProfileLoaderInterface
	WorkoutLogLoader WorkoutLogLoaderInterface
	SetLogLoader     SetLogLoaderInterface
	WorkoutTypeLoader WorkoutTypeLoaderInterface
}

func NewDataLoaders(db *gorm.DB) *DataLoaders {
	return &DataLoaders{
		ProfileLoader: NewProfileLoader(db),
		WorkoutLogLoader:  NewWorkoutLogLoader(db),
		SetLogLoader:      NewSetLogLoader(db),
		WorkoutTypeLoader: NewWorkoutTypeLoader(db),
	}
}

const DataLoadersContextKey ContextKey = "dataLoaders"

func WithDataLoaders(ctx context.Context, db *gorm.DB) context.Context {
	loaders := NewDataLoaders(db)
	return context.WithValue(ctx, DataLoadersContextKey, loaders)
}

func For(ctx context.Context) *DataLoaders {
	loaders, ok := ctx.Value(DataLoadersContextKey).(*DataLoaders)
	if !ok {
		panic("no dataloaders found in context")
	}
	return loaders
}