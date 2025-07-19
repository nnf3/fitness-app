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
