# Makefile
.PHONY: migrate-create migrate-up migrate-down

# マイグレーションファイル作成
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir db/migrations -seq $$name

# マイグレーション実行
migrate-up:
	migrate -database "postgres://$${DB_USER}:$${DB_PASSWORD}@$${DB_HOST}:5432/$${DB_NAME}?sslmode=disable" -path db/migrations up 1

# マイグレーションロールバック
migrate-down:
	migrate -database "postgres://$${DB_USER}:$${DB_PASSWORD}@$${DB_HOST}:5432/$${DB_NAME}?sslmode=disable" -path db/migrations down 1

# GQLスキーマ生成
gqlgen-generate:
	go run github.com/99designs/gqlgen generate