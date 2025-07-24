# Expoアプリへようこそ 👋

これは [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) で作成された [Expo](https://expo.dev) プロジェクトです。

## はじめに

1. 依存関係をインストール

   ```bash
   npm install
   ```

2. 環境変数を設定

   ```bash
   # .env.localファイルを生成（既存ファイルは保持）
   make env

   # または、既存ファイルを強制上書き
   make env-force
   ```

   これにより、ローカルIPアドレスが自動検出され、以下の変数を含む `.env.local` ファイルが作成されます：
   - `EXPO_PUBLIC_SERVER_IP`: ローカルIPアドレス（自動検出）
   - `EXPO_PUBLIC_SERVER_PORT`: サーバーポート（デフォルト: 8080）

3. アプリを起動

   ```bash
   npx expo start
   ```

出力で、以下のオプションからアプリを開くことができます：

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android エミュレータ](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS シミュレータ](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) - Expo でのアプリ開発を試すための限定サンドボックス

**app** ディレクトリ内のファイルを編集して開発を開始できます。このプロジェクトは [ファイルベースルーティング](https://docs.expo.dev/router/introduction) を使用しています。

## 環境変数

このプロジェクトは、GraphQLサーバーに接続するために環境変数を使用します。Makefileが自動的にセットアップを処理します：

### 利用可能なコマンド

```bash
# 現在の環境変数を確認
make help

# .env.localファイルを生成（既存ファイルは保持）
make env

# .env.localファイルを強制上書き
make env-force
```

### 手動設定

環境変数を手動で設定したい場合は、clientディレクトリに `.env.local` ファイルを作成してください：

```bash
EXPO_PUBLIC_SERVER_IP=192.168.0.3
EXPO_PUBLIC_SERVER_PORT=8080
```

**注意**: `192.168.0.3` を実際のローカルIPアドレスに置き換えてください。IPアドレスは以下のコマンドで確認できます：
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## EAS Build

このプロジェクトは [EAS Build](https://docs.expo.dev/build/introduction/) を使用してネイティブアプリをビルドします。

### 前提条件

1. **EAS CLIのインストール**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **EASアカウントにログイン**
   ```bash
   eas login
   ```

3. **プロジェクトの設定**
   ```bash
   eas build:configure
   ```

### 環境変数の設定

EAS Buildでは、EAS環境変数を使用します。eas.jsonで環境変数を参照するように設定されています：

```json
"env": {
  "EXPO_PUBLIC_SERVER_IP": "EXPO_PUBLIC_SERVER_IP",
  "EXPO_PUBLIC_SERVER_PORT": "EXPO_PUBLIC_SERVER_PORT"
}
```

#### サーバー設定のEAS環境変数を設定

```bash
# サーバー設定をEAS環境変数に設定
make server-secret
```

**注意**: 本番環境では、実際のサーバーIPアドレスを設定してください。

### ビルドプロファイル

このプロジェクトには以下のビルドプロファイルが設定されています：

- **development**: 開発用クライアント（内部配布）
- **preview**: プレビュー用（内部配布）
- **production**: 本番用（App Store/Google Play配布）

### ビルド実行

#### iOSビルド

```bash
# 開発用ビルド
eas build --platform ios --profile development

# プレビュー用ビルド
eas build --platform ios --profile preview

# 本番用ビルド
eas build --platform ios --profile production
```

#### Androidビルド

```bash
# 開発用ビルド（APK）
eas build --platform android --profile development

# プレビュー用ビルド
eas build --platform android --profile preview

# 本番用ビルド（AAB）
eas build --platform android --profile production
```

### トラブルシューティング

#### GoogleService-Info.plistが見つからないエラー

```bash
# 1. Firebase ConsoleからGoogleService-Info.plistをダウンロード
# 2. clientディレクトリに配置
# 3. Gitにコミット
git add GoogleService-Info.plist
git commit -m "Add GoogleService-Info.plist"
```

#### 環境変数が読み込まれない

```bash
# EAS環境変数を設定
make server-secret

# または、eas.jsonの環境変数設定を確認
cat eas.json
```

#### ビルドが失敗する

1. **EAS CLIのバージョンを確認**
   ```bash
   eas --version
   ```

2. **プロジェクトの設定を確認**
   ```bash
   eas build:configure
   ```

3. **ログを確認**
   ```bash
   eas build:list
   ```

### 設定ファイル

- `eas.json`: EAS Buildの設定ファイル
- `app.json`: Expoアプリの設定ファイル
- `GoogleService-Info.plist`: Firebase設定ファイル
- `google-services.json`: Android用Firebase設定ファイル

## GraphQL Code Generator

このプロジェクトでは、GraphQLスキーマからTypeScriptの型定義を自動生成するためにGraphQL Code Generatorを使用しています。

### コード生成

サーバーのGraphQLスキーマが変更された場合、クライアント側の型定義を更新する必要があります：

```bash
# GraphQLコードを生成
npm run codegen
```

または、Makefileを使用：

```bash
# 環境変数設定とコード生成を同時実行
make env && npm run codegen
```

### 生成されるファイル

- `types/graphql.ts`: GraphQLクエリとミューテーションの型定義
- `graphql.d.ts`: GraphQLの型定義ファイル

### 設定ファイル

- `codegen.yml`: GraphQL Code Generatorの設定ファイル
- スキーマソース: `../server/graph/schema/*.graphqls`
- ドキュメントソース: `./app/**/*.{ts,tsx}`

### 使用例

生成された型定義を使用してGraphQLクエリを書く例：

```typescript
import { gql, useQuery } from "@apollo/client";
import { UsersQuery } from "../types/graphql";

const GET_USERS = gql`
  query users {
    users {
      id
      name
    }
  }
`;

export default function Index() {
  const { data, loading, error } = useQuery<UsersQuery>(GET_USERS);
  // ...
}
```

## 新しいプロジェクトを取得

準備ができたら、以下を実行してください：

```bash
npm run reset-project
```

このコマンドは、スターターコードを **app-example** ディレクトリに移動し、開発を開始できる空の **app** ディレクトリを作成します。

## 詳細情報

Expo でのプロジェクト開発について詳しく学ぶには、以下のリソースをご覧ください：

- [Expo ドキュメント](https://docs.expo.dev/): 基礎を学ぶか、[ガイド](https://docs.expo.dev/guides)で高度なトピックに進んでください。
- [Expo チュートリアル](https://docs.expo.dev/tutorial/introduction/): Android、iOS、Web で動作するプロジェクトを作成するステップバイステップのチュートリアルに従ってください。

## コミュニティに参加

ユニバーサルアプリを作成する開発者のコミュニティに参加しましょう。

- [GitHub の Expo](https://github.com/expo/expo): オープンソースプラットフォームを確認し、貢献してください。
- [Discord コミュニティ](https://chat.expo.dev): Expo ユーザーとチャットし、質問してください。
