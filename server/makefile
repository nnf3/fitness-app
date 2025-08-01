.PHONY: gqlgen-generate test test-entity

# GQLスキーマ生成
gqlgen-generate:
	go run github.com/99designs/gqlgen generate

# 全テスト実行
test:
	go test ./...

# entity層のテスト実行
test-entity:
	go test ./entity/...

# テストカバレッジ実行
test-coverage:
	go test ./... -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html