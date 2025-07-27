# Expoアプリへようこそ 👋

これは [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) で作成された [Expo](https://expo.dev) プロジェクトです。

## はじめに

1. 依存関係をインストール

   ```bash
   npm install
   ```

2. 環境変数を設定

   ```bash
   # 事前にEAS CLIをインストールする必要があります
   npm install -g @expo/eas-cli

   # expo.devから環境変数を取得し、ローカルIPなどを設定
   make setup-dev
   ```

3. アプリを起動

   ```bash
   npx expo start --dev-client
   ```

**注意**: この方法を使用するには、事前にdevelopment buildをローカルにインストールする必要があります。

- iOS : [expo.dev](https://expo.dev/accounts/nnf3/projects/fitness-app/development-builds) から IPA ファイルをインストールしてください
- Android : 現状まだ用意されてません

**app** ディレクトリ内のファイルを編集して開発を開始できます。このプロジェクトは [ファイルベースルーティング](https://docs.expo.dev/router/introduction) を使用しています。

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

4. .gitignoreをコメントアウト
   ```.gitignore
   # **/*.plist
   # **/google-services.json
   ```

   本来はコメントアウトせずとも読み込んでくれるはずですが、エラーが出ているため暫定対応です。

4. **Development Buildの作成とインストール**
   ```bash
   # iOS development buildを作成（.env.localから環境変数を自動読み込み）
   make build-ios-dev

   # Android development buildを作成（.env.localから環境変数を自動読み込み）
   make build-android-dev
   ```

   作成されたbuildをローカルデバイスにインストールしてください。

   **注意**: これらのコマンドは`.env.local`ファイルから`EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID`のみを自動的に読み込みます。先に`make setup-dev`を実行してください。

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
- `app.config.ts`: Expoアプリの設定ファイル
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
