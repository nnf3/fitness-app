# Fitness App Backend

Go言語とgqlgenを使用したフィットネスアプリのGraphQLバックエンドサーバーです。

## 技術スタック

- **言語**: Go 1.24
- **GraphQL**: gqlgen
- **データベース**: PostgreSQL
- **ORM**: GORM
- **マイグレーション**: golang-migrate
- **テストフレームワーク**: testify
- **開発環境**: Docker + Air (ホットリロード)

## 前提条件

- Docker
- Docker Compose
- Make (オプション、マイグレーション管理用)

## セットアップ

### 1. 環境変数の設定

```sh
# プロジェクトルートで実行
cp .env.sample .env
```

### 2. ビルド & 依存関係のインストール

```sh
# プロジェクトルートで実行
docker compose build
docker compose run --rm server sh -c "go get app"
```

### 3. サーバーの起動

```sh
# プロジェクトルートで実行
# 開発サーバーを起動（ホットリロード有効）
docker compose up server
```

GraphQL Playgroundでクエリを実行できます：
- **URL**: http://localhost:8080
- **エンドポイント**: http://localhost:8080/query

## 開発

### サーバーの起動・停止

```sh
# サーバーを起動
docker compose up server

# バックグラウンドで起動
docker compose up -d server

# サーバーを停止
docker compose down

# ログを確認
docker compose logs -f server
```

### コンテナ内での作業

```sh
# サーバーコンテナに入る
docker compose exec server bash
```

## データベース管理

### マイグレーション

Makefileを使用した簡単なマイグレーション管理：

```sh
# サーバーコンテナに入る
docker compose exec server bash

# 新しいマイグレーションファイルを作成
make migrate-create
# プロンプトが表示されるので、マイグレーション名を入力（例: create_users）

# マイグレーションを実行
make migrate-up

# マイグレーションをロールバック
make migrate-down
```

### データベース操作

```sh
# PostgreSQLに接続
docker compose exec db psql -U postgres -d fitness_app

# テーブル一覧を表示
\dt

# テーブル構造を確認
\d table_name

# SQLクエリを実行
SELECT * FROM users;

# データベースから抜ける
\q
```

### pgAdmin (推奨)

PostgreSQLの管理ツールpgAdminを使用すると、GUIからデータベースを簡単に操作できます：

```sh
# pgAdminコンテナを起動
docker compose up pgadmin

# ブラウザでアクセス
# http://localhost:8081
# ユーザー名: admin@example.com
# パスワード: password
```

pgAdminの利点：
- テーブル構造の視覚的な確認
- SQLクエリの実行と結果の表示
- データの編集・削除
- インデックスや制約の管理
- バックアップ・リストア機能

初回接続時は、サーバー設定で以下を入力してください：
- **ホスト**: db
- **ポート**: 5432
- **ユーザー名**: postgres
- **パスワード**: password
- **データベース**: fitness_app


## トラブルシューティング

### よくある問題

#### 1. 依存関係の問題

```sh
# go.modとgo.sumを再同期
docker compose exec server go mod tidy

# キャッシュをクリアして再ビルド
docker compose build --no-cache server
```

## テスト実行方法

### ローカルでのテスト実行

```sh
# サーバーコンテナに入る
docker compose exec server bash

# テスト実行
go test ./...
```

## GraphQL開発

### スキーマの管理

GraphQLスキーマは以下のように分割されています：

```
server/graph/
├── schema/
│   ├── types.graphqls       # 型定義
│   ├── query.graphqls       # クエリ定義
│   └── mutation.graphqls    # ミューテーション定義
├── generated.go             # 生成されたコード（修正不可）
├── query.resolvers.go       # クエリリゾルバー
├── mutation.resolvers.go    # ミューテーションリゾルバー
├── resolver.go              # リゾルバー構造体
└── model/
    └── models_gen.go        # 生成されたモデル（修正不可）
```

### コード生成

スキーマを変更した後は、コードを再生成する必要があります：

```sh
# サーバーコンテナに入る
docker compose exec server bash

# GraphQLコードを再生成
make gqlgen-generate
```

### サンプルクエリ

GraphQL Playgroundで以下のクエリを実行できます：

```graphql
# ユーザー一覧を取得
query {
  users {
    id
    name
  }
}

# ユーザーを作成
mutation {
  createUser(input: { name: "John Doe" }) {
    id
    name
  }
}
```

## プロジェクト構造

```
server/
├── server.go              # エントリーポイント
├── go.mod                 # Goモジュール定義
├── go.sum                 # 依存関係チェックサム
├── gqlgen.yml             # gqlgen設定ファイル
├── Dockerfile.dev         # 開発用Dockerfile
├── .air.toml              # Air設定ファイル
├── graph/                 # GraphQL関連ファイル
│   ├── schema.graphqls    # メインスキーマ
│   ├── schema/            # 分割されたスキーマ
│   ├── generated.go       # 生成されたコード
│   ├── query.resolvers.go # クエリリゾルバー
│   ├── mutation.resolvers.go # ミューテーションリゾルバー
│   └── model/             # 生成されたモデル
├── entity/                # データエンティティ
├── db/                    # データベース関連
│   └── migrations/        # マイグレーションファイル
└── makefile               # 作業自動化
```