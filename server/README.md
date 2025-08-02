# Fitness App Backend

Go言語とgqlgenを使用したフィットネスアプリのGraphQLバックエンドサーバーです。

## 技術スタック

- **言語**: Go 1.24
- **GraphQL**: gqlgen
- **データベース**: PostgreSQL
- **ORM**: GORM
- **マイグレーション**: gormigrate
- **テストフレームワーク**: testify
- **開発環境**: Docker + Air (ホットリロード)

## 前提条件

- Docker
- Docker Compose
- Make

## セットアップ

### 1. 環境変数の設定

```sh
# プロジェクトルートで実行
cp .env.sample .env
touch server/google/serviceAccountKey.json
```

**注意点**
以下の環境変数とファイルは管理者から渡された情報で上書きしてください
- FIREBASE_PROJECT_IDの値
- google/serviceAccountKey.jsonの中身

### 2. ビルド & 依存関係のインストール

```sh
# プロジェクトルートで実行
docker compose build
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

gormigrate + gorm auto-migration を使います。
`gorm.Model` で sturct を定義した後、`db/database.go` に Migration を追加していきます。
詳しくは `db/database.go` を参照ください。

#### マイグレーション実行

**重要**: サーバー起動時には自動的にマイグレーションは実行されません。マイグレーションは手動で実行する必要があります。

マイグレーションを実行する場合は、以下のコマンドを使用します：

```sh
# サーバーコンテナに入る
docker compose exec server bash

# 全てのマイグレーションを実行
make migrate-all

# 指定したマイグレーションまで実行
make migrate-to

```

**初回セットアップ時**:
```sh
# 1. サーバーを起動（データベース接続のみ）
docker compose up server

# 2. 別のターミナルでマイグレーションを実行
docker compose exec server make migrate-all

# 3. 初期データを登録（オプション）
docker compose exec server make seed-data
```

**開発時のワークフロー**:
```sh
# 新しいマイグレーションを追加した場合
# 1. サーバーを起動
docker compose up server

# 2. マイグレーションを実行
docker compose exec server make migrate-all

# 3. 初期データを登録（必要に応じて）
docker compose exec server make seed-data

# 4. 必要に応じてロールバック
docker compose exec server make rollback-last
```

#### ロールバック

マイグレーションをロールバックする場合は、以下のコマンドを使用します：

```sh
# サーバーコンテナに入る
docker compose exec server bash

# 最後のマイグレーションをロールバック
make rollback-last

# 指定したマイグレーションまでロールバック
make rollback-to

```

**注意**: ロールバックは慎重に実行してください。データが失われる可能性があります。

#### 初期データ管理

初期データ（筋トレ種目など）は独立したコマンドで管理します：

```sh
# サーバーコンテナに入る
docker compose exec server bash

# 初期データを登録
make seed-data

# 初期データを削除
make remove-seed-data
```

**特徴**:
- ✅ **独立した管理**: マイグレーションとは独立して実行
- ✅ **柔軟性**: YAMLファイルの変更に応じて再実行可能
- ✅ **安全な削除**: 物理削除で完全にデータを削除
- ✅ **重複チェック**: 既存データとの重複を自動チェック

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

## Adminユーザーアクセス

開発環境では、Firebase認証に依存せずにadminユーザーとしてアクセスできるモック認証機能が利用できます。

### 使用方法

GraphQL Playground（http://localhost:8080）で以下の手順でadminユーザーとしてアクセスできます：

1. **HTTP HEADERS**セクションに以下を追加：
```json
{
  "Authorization": "admin-user-123"
}
```

2. **クエリ例**：
```graphql
# 全ユーザー一覧を取得（adminユーザーのみ実行可能）
query {
  users {
    id
    uid
    createdAt
    profile {
      name
      birthDate
      gender
      height
      weight
      activityLevel
    }
  }
}

# 現在のユーザー情報を取得
query {
  currentUser {
    id
    uid
    profile {
      name
      birthDate
      gender
      height
      weight
      activityLevel
    }
  }
}
```


### 注意事項

- **開発環境のみ**: この機能は開発環境でのみ使用してください
- **本番環境**: 本番環境では`ENABLE_MOCK_AUTH=false`に設定するか、環境変数を削除してください
- **セキュリティ**: モックトークンは固定値のため、本番環境では使用しないでください
- **データベース**: adminユーザーはマイグレーション時に自動的に作成されます


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
└── makefile               # 作業自動化
```

## 本番デプロイ

CI/CD パイプラインで自動化してます。
main ブランチへのマージをトリガーにデプロイが実行されます。

### Artifact Registryへの手動イメージプッシュ

**注意**: 本番デプロイはGitHub Actionsで自動化予定です。以下は手動でプッシュする場合のコマンドです。

```bash
# プロジェクトIDとリポジトリ名を設定
export PROJECT_ID="fitness-app-prd"
export REPOSITORY="fitness-api"
export REGION="asia-northeast1"

# Docker認証の設定
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# イメージをビルド（重要：プラットフォームを指定）
docker build --platform linux/amd64 -t fitness-api .

# イメージにタグを付ける
docker tag fitness-api ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/fitness-api:latest

# イメージをプッシュ
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/fitness-api:latest
```

**🚨 重要**: macOS（Apple Silicon）でビルドする場合は、必ず`--platform linux/amd64`を指定してください。Cloud Runはx86_64/AMD64アーキテクチャを要求します。