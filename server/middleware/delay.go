package middleware

import (
	"log"
	"net/http"
	"time"
)

const (
	// DelaySeconds はローディング状態のテスト用の遅延時間（秒）
	// 0に設定すると遅延なし、任意の秒数に変更可能（例：3で3秒の遅延）
	DelaySeconds = 0
)

// DelayMiddleware はローディング状態のテスト用にリクエストに遅延を追加するミドルウェア
func DelayMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if DelaySeconds > 0 {
			log.Printf("⏳ Adding %d-second delay for request: %s", DelaySeconds, r.URL.Path)
			time.Sleep(time.Duration(DelaySeconds) * time.Second)
			log.Printf("✅ Delay completed for request: %s", r.URL.Path)
		}

		next.ServeHTTP(w, r)
	})
}
