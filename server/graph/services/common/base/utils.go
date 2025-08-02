package base

import (
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
)

// convertKeysToStrings はStringKeyスライスを文字列スライスに変換します
func convertKeysToStrings(keys []StringKey) []string {
	keyStrings := make([]string, len(keys))
	for i, key := range keys {
		keyStrings[i] = string(key)
	}
	return keyStrings
}

// CreateErrorResults は全てのキーに対してエラー結果を作成します
func CreateErrorResults[T any](keys []string, err error) []*dataloader.Result[T] {
	results := make([]*dataloader.Result[T], len(keys))
	for i := range results {
		results[i] = &dataloader.Result[T]{
			Error: err,
		}
	}
	return results
}

// LoadGeneric は汎用的なローダー関数です
func LoadGeneric[T any, K comparable](
	ctx context.Context,
	loader *dataloader.Loader[K, T],
	key K,
) (T, error) {
	thunk := loader.Load(ctx, key)
	result, err := thunk()
	if err != nil {
		var zero T
		return zero, err
	}
	return result, nil
}

// ConvertToStringKeys は文字列スライスをStringKeyスライスに変換します
func ConvertToStringKeys(keys []string) []StringKey {
	result := make([]StringKey, len(keys))
	for i, key := range keys {
		result[i] = StringKey(key)
	}
	return result
}

// ParseUintKey は文字列キーをuint IDに変換する共通のパース関数です
func ParseUintKey(key string) (uint, error) {
	if id, err := strconv.ParseUint(key, 10, 32); err == nil {
		return uint(id), nil
	}
	return 0, fmt.Errorf(ErrInvalidKey, key)
}
