package dataloader

import (
	"context"
	"fmt"
	"strconv"

	"github.com/graph-gophers/dataloader/v7"
)

// エラーメッセージの定数
const (
	ErrInvalidID  = "invalid ID: %s"
	ErrInvalidKey = "invalid key: %s"
)

type BaseLoaderKey interface {
	String() string
	Raw() interface{}
}

type StringKey string

func (k StringKey) String() string {
	return string(k)
}

func (k StringKey) Raw() interface{} {
	return string(k)
}

// データローダー用の共通機能を提供
type BaseLoader struct{}

// 文字列キーをuint IDに変換
func (b *BaseLoader) ParseUintKeys(keys []string) ([]uint, []error) {
	var ids []uint
	var errors []error

	for _, key := range keys {
		if id, err := strconv.ParseUint(key, 10, 32); err == nil {
			ids = append(ids, uint(id))
		} else {
			errors = append(errors, fmt.Errorf(ErrInvalidID, key))
		}
	}

	return ids, errors
}

func convertKeysToStrings(keys []StringKey) []string {
	keyStrings := make([]string, len(keys))
	for i, key := range keys {
		keyStrings[i] = string(key)
	}
	return keyStrings
}

// 全てのキーに対してエラー結果を作成
func CreateErrorResults[T any](keys []string, err error) []*dataloader.Result[T] {
	results := make([]*dataloader.Result[T], len(keys))
	for i := range results {
		results[i] = &dataloader.Result[T]{
			Error: err,
		}
	}
	return results
}

// マップから結果を作成し、キーの順序を保持
func CreateResultsFromMap[T any](
	keys []string,
	dataMap map[uint]*T,
	parseKey func(string) (uint, error),
) []*dataloader.Result[*T] {
	results := make([]*dataloader.Result[*T], len(keys))

	for i, key := range keys {
		if id, err := parseKey(key); err == nil {
			if data, exists := dataMap[id]; exists {
				results[i] = &dataloader.Result[*T]{
					Data: data,
				}
			} else {
				// データが存在しない場合、nilを返す
				results[i] = &dataloader.Result[*T]{
					Data: nil,
				}
			}
		} else {
			results[i] = &dataloader.Result[*T]{
				Error: fmt.Errorf(ErrInvalidKey, key),
			}
		}
	}

	return results
}

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

func LoadManyGeneric[T any, K comparable](
	ctx context.Context,
	loader *dataloader.Loader[K, T],
	keys []K,
) ([]T, []error) {
	thunkMany := loader.LoadMany(ctx, keys)
	return thunkMany()
}

func ConvertToStringKeys(keys []string) []StringKey {
	result := make([]StringKey, len(keys))
	for i, key := range keys {
		result[i] = StringKey(key)
	}
	return result
}
