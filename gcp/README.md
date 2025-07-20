# GCP Infrastructure

このディレクトリには、Fitness AppのGCPインフラストラクチャを管理するためのTerraformコードが含まれています。

## 📁 ディレクトリ構造

```
gcp/
├── modules/
│   ├── auth/         # 認証関連のリソース
│   ├── firebase/     # Firebaseプロジェクトとストレージ
│   └── storage/      # Cloud Storageバケット
├── envs/             # 環境別の設定
│   ├── dev/          # 開発環境
│   └── prd/          # 本番環境
└── .gitignore        # Git除外設定
```

## 🚀 クイックスタート

### 前提条件

- [Terraform](https://www.terraform.io/downloads.html) (v1.0以上)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- GCPプロジェクトの作成済み
- 適切な権限を持つサービスアカウントキー

### 初期設定

1. **サービスアカウントキーの配置**
   ```bash
   # credentials.jsonをgcp/envs/prd/に配置
   cp /path/to/your/credentials.json gcp/envs/prd/credentials.json
   ```

2. **環境の初期化**
   ```bash
   cd gcp/envs/prd
   make init
   ```

## 📋 利用可能なコマンド

### 本番環境 (prd)

```bash
cd gcp/envs/prd

# 初期化（プロジェクトIDの設定、API有効化）
make init

# Terraformプランの実行
terraform plan

# Terraform
terraform apply
```

## 🏗️ モジュール詳細

### Storage Module (`modules/storage/`)

Cloud Storageバケットを作成します。

**リソース:**
- `google_storage_bucket.storage`: アプリケーション用のストレージバケット

**変数:**
- `env`: 環境名 (dev/prd)
- `project_id`: GCPプロジェクトID

**設定:**
- リージョン: `asia-northeast1`
- 統一バケットレベルアクセス: 有効

### Firebase Module (`modules/firebase/`)

Firebaseプロジェクトとストレージバケットを作成します。

**リソース:**
- `google_project_service.firebase`: Firebase Management APIの有効化
- `google_firebase_project.project`: Firebaseプロジェクト
- `google_firebase_storage_bucket.storage`: Firebase Storageバケット

**変数:**
- `project_id`: GCPプロジェクトID
- `storage_bucket_id`: 既存のストレージバケットID

**依存関係:**
- Storage Moduleのストレージバケットに依存