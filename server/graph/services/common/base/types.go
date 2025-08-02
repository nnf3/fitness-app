package base

import (
	"context"
)

// エラーメッセージの定数
const (
	ErrInvalidID  = "invalid ID: %s"
	ErrInvalidKey = "invalid key: %s"
)

// StringKey はDataLoaderで使用する文字列キーの型です
type StringKey string

func (k StringKey) String() string {
	return string(k)
}

func (k StringKey) Raw() interface{} {
	return string(k)
}

// BaseLoaderInterface は共通のローダーインターフェースです
type BaseLoaderInterface[T any] interface {
	Load(ctx context.Context, key string) (T, error)
}
