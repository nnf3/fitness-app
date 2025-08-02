# DataLoader Implementation

このディレクトリには、GraphQL DataLoaderの実装が含まれています。DataLoader v7の機能を活用して、N+1問題を解決し、パフォーマンスを最適化しています。

## アーキテクチャ

### 共通化されたベースローダー

DataLoaderの実装を共通化し、重複コードを削減しました：

#### BaseLoader[T]
単一のエンティティを返すDataLoader用の共通実装です。

```go
type BaseLoader[T any] struct {
    db     *gorm.DB
    loader *dataloader.Loader[StringKey, T]

    // バッチ処理用の関数
    fetchFunc func([]uint) ([]T, error)
    createMapFunc func([]T) map[uint]T
    parseKeyFunc func(string) (uint, error)
}
```

#### BaseArrayLoader[T]
配列のエンティティを返すDataLoader用の共通実装です。

```go
type BaseArrayLoader[T any] struct {
    db     *gorm.DB
    loader *dataloader.Loader[StringKey, []*T]

    // バッチ処理用の関数
    fetchFunc func([]uint) ([]*T, error)
    createMapFunc func([]*T) map[uint][]*T
    parseKeyFunc func(string) (uint, error)
}
```

## 機能

### 1. ベースローダー (`base/`)
- **`ParseUintKey`**: 文字列キーを数値IDに変換
- **`CreateErrorResults`**: エラー時の結果生成
- **`LoadGeneric`**: 汎用的なローダー関数
- **`ConvertToStringKeys`**: 文字列スライスをStringKeyスライスに変換

### 2. エンティティ別ローダー
- **`UserLoader`**: ユーザー情報のロード
- **`ProfileLoader`**: プロファイル情報のロード
- **`FriendshipLoader`**: 友達関係のロード
- **`WorkoutLogLoader`**: ワークアウトログのロード
- **`WorkoutTypeLoader`**: ワークアウトタイプのロード
- **`SetLogLoader`**: セットログのロード

## 使用方法

### 基本的な使用

```go
// ローダーの作成
loader := NewUserLoader(db)

// 単一ユーザーのロード
user, err := loader.LoadUser(ctx, "123")
if err != nil {
    // エラーハンドリング
}
```

### 配列エンティティのロード

```go
// ワークアウトログのロード
workoutLogLoader := NewWorkoutLogLoader(db)
logs, err := workoutLogLoader.LoadWorkoutLogs(ctx, "123")
if err != nil {
    // エラーハンドリング
}
```

### 新しいローダーの作成

#### 単一エンティティ用

```go
type UserLoader struct {
    *base.BaseLoader[*entity.User]
}

func NewUserLoader(db *gorm.DB) UserLoaderInterface {
    loader := &UserLoader{}
    loader.BaseLoader = base.NewBaseLoader(
        db,
        loader.fetchUsersFromDB,
        loader.createUserMap,
        base.ParseUintKey,
    )
    return loader
}

func (l *UserLoader) fetchUsersFromDB(userIDs []uint) ([]*entity.User, error) {
    var users []entity.User
    err := l.DB().Where("id IN ?", userIDs).Find(&users).Error
    if err != nil {
        return nil, err
    }

    result := make([]*entity.User, len(users))
    for i := range users {
        result[i] = &users[i]
    }
    return result, nil
}

func (l *UserLoader) createUserMap(users []*entity.User) map[uint]*entity.User {
    userMap := make(map[uint]*entity.User)
    for _, user := range users {
        userMap[user.ID] = user
    }
    return userMap
}
```

#### 配列エンティティ用

```go
type WorkoutLogLoader struct {
    *base.BaseArrayLoader[entity.WorkoutLog]
}

func NewWorkoutLogLoader(db *gorm.DB) WorkoutLogLoaderInterface {
    loader := &WorkoutLogLoader{}
    loader.BaseArrayLoader = base.NewBaseArrayLoader(
        db,
        loader.fetchWorkoutLogsFromDB,
        loader.createWorkoutLogMap,
        base.ParseUintKey,
    )
    return loader
}

func (l *WorkoutLogLoader) fetchWorkoutLogsFromDB(userIDs []uint) ([]*entity.WorkoutLog, error) {
    var logs []entity.WorkoutLog
    err := l.DB().Where("user_id IN ?", userIDs).Find(&logs).Error
    if err != nil {
        return nil, err
    }

    result := make([]*entity.WorkoutLog, len(logs))
    for i := range logs {
        result[i] = &logs[i]
    }
    return result, nil
}

func (l *WorkoutLogLoader) createWorkoutLogMap(logs []*entity.WorkoutLog) map[uint][]*entity.WorkoutLog {
    workoutLogMap := make(map[uint][]*entity.WorkoutLog)
    for _, log := range logs {
        workoutLogMap[log.UserID] = append(workoutLogMap[log.UserID], log)
    }
    return workoutLogMap
}
```

## DataLoader v7の主な機能

- **`Load`**: 単一キーのロード
- **`Prime`**: キャッシュへの事前データ投入
- **`Clear`**: 特定キーのキャッシュクリア
- **`ClearAll`**: 全キャッシュクリア
- **`WithCache`**: カスタムキャッシュ設定
- **`WithBatchCapacity`**: バッチ容量設定
- **`WithWait`**: バッチ待機時間設定
- **`WithTracer`**: トレーシング設定

## パフォーマンス最適化

1. **バッチ処理**: 複数のリクエストを自動的にバッチ化
2. **キャッシュ**: メモリ内キャッシュによる重複リクエストの削減
3. **遅延実行**: バッチウィンドウ内での遅延実行
4. **エラーハンドリング**: 統一されたエラー処理

## 参考リンク

- [DataLoader v7 Documentation](https://pkg.go.dev/github.com/graph-gophers/dataloader/v7)
- [Facebook DataLoader](https://github.com/facebook/dataloader)