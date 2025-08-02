package base

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

// BaseLoader は単一エンティティ用の共通ローダー構造体です
type BaseLoader[T any] struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, T]

	// バッチ処理用の関数
	fetchFunc     func([]uint) ([]T, error)  // データベースからデータを取得する関数
	createMapFunc func([]T) map[uint]T       // データをマップに変換する関数
	parseKeyFunc  func(string) (uint, error) // キーをパースする関数
}

// DB はデータベースインスタンスを取得します
func (b *BaseLoader[T]) DB() *gorm.DB {
	return b.db
}

// NewBaseLoader は新しいベースローダーを作成します
func NewBaseLoader[T any](
	db *gorm.DB,
	fetchFunc func([]uint) ([]T, error),
	createMapFunc func([]T) map[uint]T,
	parseKeyFunc func(string) (uint, error),
) *BaseLoader[T] {
	loader := &BaseLoader[T]{
		db:            db,
		fetchFunc:     fetchFunc,
		createMapFunc: createMapFunc,
		parseKeyFunc:  parseKeyFunc,
	}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

// batchLoad はバッチ処理の共通実装です
func (b *BaseLoader[T]) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[T] {
	keyStrings := convertKeysToStrings(keys)

	// キーをパース
	var ids []uint
	var errors []error
	for _, key := range keyStrings {
		if id, err := b.parseKeyFunc(key); err == nil {
			ids = append(ids, id)
		} else {
			errors = append(errors, fmt.Errorf(ErrInvalidKey, key))
		}
	}

	if len(errors) > 0 {
		return CreateErrorResults[T](keyStrings, fmt.Errorf("failed to parse keys"))
	}

	// データを取得
	data, err := b.fetchFunc(ids)
	if err != nil {
		return CreateErrorResults[T](keyStrings, fmt.Errorf("failed to fetch data: %w", err))
	}

	// 結果を作成
	return b.createResults(keyStrings, data)
}

// createResults は結果作成の共通実装です
func (b *BaseLoader[T]) createResults(keyStrings []string, data []T) []*dataloader.Result[T] {
	dataMap := b.createMapFunc(data)

	results := make([]*dataloader.Result[T], len(keyStrings))
	for i, key := range keyStrings {
		if id, err := b.parseKeyFunc(key); err == nil {
			if item, exists := dataMap[id]; exists {
				results[i] = &dataloader.Result[T]{
					Data: item,
				}
			} else {
				// データが存在しない場合、ゼロ値を返す
				var zero T
				results[i] = &dataloader.Result[T]{
					Data: zero,
				}
			}
		} else {
			results[i] = &dataloader.Result[T]{
				Error: fmt.Errorf(ErrInvalidKey, key),
			}
		}
	}

	return results
}

// Load は単一エンティティのロードの共通実装です
func (b *BaseLoader[T]) Load(ctx context.Context, key string) (T, error) {
	return LoadGeneric(ctx, b.loader, StringKey(key))
}
