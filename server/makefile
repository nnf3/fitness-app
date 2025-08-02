.PHONY: gqlgen-generate test test-entity rollback rollback-last rollback-to migrate migrate-all migrate-to seed-data remove-seed-data

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

# ロールバックコマンドのビルド
rollback-build:
	go build -o rollback cmd/rollback/main.go

# 最後のマイグレーションをロールバック
rollback-last: rollback-build
	./rollback -last

# 指定したマイグレーションまでロールバック
rollback-to:
	@read -p "ロールバック対象のマイグレーションIDを入力してください: " migration_id; \
	./rollback -to $$migration_id

# マイグレーションコマンドのビルド
migrate-build:
	go build -o migrate cmd/migrate/main.go

# 全てのマイグレーションを実行
migrate-all: migrate-build
	./migrate -all

# 指定したマイグレーションまで実行
migrate-to:
	@read -p "マイグレーション対象のマイグレーションIDを入力してください: " migration_id; \
	./migrate -to $$migration_id

# 初期データ管理コマンドのビルド
seed-build:
	go build -o seed cmd/seed/main.go

# 初期データを登録
seed-data: seed-build
	./seed -seed

# 初期データを削除
remove-seed-data: seed-build
	./seed -remove