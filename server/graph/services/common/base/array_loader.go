package base

import (
	"context"
	"fmt"

	"github.com/graph-gophers/dataloader/v7"
	"gorm.io/gorm"
)

// BaseArrayLoader は配列エンティティ用の共通ローダー構造体です
type BaseArrayLoader[T any] struct {
	db     *gorm.DB
	loader *dataloader.Loader[StringKey, []*T]

	// バッチ処理用の関数
	fetchFunc     func([]uint) ([]*T, error) // データベースからデータを取得する関数
	createMapFunc func([]*T) map[uint][]*T   // データをマップに変換する関数
	parseKeyFunc  func(string) (uint, error) // キーをパースする関数
}

// DB はデータベースインスタンスを取得します
func (b *BaseArrayLoader[T]) DB() *gorm.DB {
	return b.db
}

// NewBaseArrayLoader は新しい配列ベースローダーを作成します
func NewBaseArrayLoader[T any](
	db *gorm.DB,
	fetchFunc func([]uint) ([]*T, error),
	createMapFunc func([]*T) map[uint][]*T,
	parseKeyFunc func(string) (uint, error),
) *BaseArrayLoader[T] {
	loader := &BaseArrayLoader[T]{
		db:            db,
		fetchFunc:     fetchFunc,
		createMapFunc: createMapFunc,
		parseKeyFunc:  parseKeyFunc,
	}
	loader.loader = dataloader.NewBatchedLoader(loader.batchLoad)
	return loader
}

// batchLoad は配列用バッチ処理の共通実装です
func (b *BaseArrayLoader[T]) batchLoad(ctx context.Context, keys []StringKey) []*dataloader.Result[[]*T] {
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
		return CreateErrorResults[[]*T](keyStrings, fmt.Errorf("failed to parse keys"))
	}

	// データを取得
	data, err := b.fetchFunc(ids)
	if err != nil {
		return CreateErrorResults[[]*T](keyStrings, fmt.Errorf("failed to fetch data: %w", err))
	}

	// 結果を作成
	return b.createResults(keyStrings, data)
}

// createResults は配列用結果作成の共通実装です
func (b *BaseArrayLoader[T]) createResults(keyStrings []string, data []*T) []*dataloader.Result[[]*T] {
	dataMap := b.createMapFunc(data)

	results := make([]*dataloader.Result[[]*T], len(keyStrings))
	for i, key := range keyStrings {
		if id, err := b.parseKeyFunc(key); err == nil {
			if items, exists := dataMap[id]; exists {
				results[i] = &dataloader.Result[[]*T]{
					Data: items,
				}
			} else {
				// データが存在しない場合、空配列を返す
				results[i] = &dataloader.Result[[]*T]{
					Data: []*T{},
				}
			}
		} else {
			results[i] = &dataloader.Result[[]*T]{
				Error: fmt.Errorf(ErrInvalidKey, key),
			}
		}
	}

	return results
}

// Load は配列用Load の共通実装です
func (b *BaseArrayLoader[T]) Load(ctx context.Context, key string) ([]*T, error) {
	return LoadGeneric(ctx, b.loader, StringKey(key))
}
