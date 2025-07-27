# DataLoader Implementation

このディレクトリには、GraphQL DataLoaderの実装が含まれています。DataLoader v7の機能を活用して、N+1問題を解決し、パフォーマンスを最適化しています。

## 機能

### 1. ベースローダー (`base.go`)
- **`ParseUintKeys`**: 文字列キーを数値IDに変換
- **`CreateErrorResults`**: エラー時の結果生成
- **`CreateResultsFromMap`**: マップから結果を生成（キー順を保持）
- **`LoadGeneric`**: 汎用的なローダー関数
- **`LoadManyGeneric`**: 複数アイテムの汎用ローダー関数

### 2. プロファイルローダー (`profile.go`)
- **`NewProfileLoader`**: 基本的なプロファイルローダー作成
- **`NewProfileLoaderWithOptions`**: カスタムオプション付きプロファイルローダー作成
- **`LoadProfile`**: 単一プロファイルのロード
- **`LoadProfiles`**: 複数プロファイルのロード

## 使用方法

### 基本的な使用

```go
// ローダーの作成
loader := NewProfileLoader(db)

// 単一プロファイルのロード
profile, err := LoadProfile(ctx, loader, "123")
if err != nil {
    // エラーハンドリング
}

// 複数プロファイルのロード
profiles, errors := LoadProfiles(ctx, loader, []string{"123", "456", "789"})
```

### カスタムオプション付きローダー

```go
// カスタムキャッシュ設定
loader := NewProfileLoaderWithOptions(db,
    dataloader.WithCache(dataloader.NewCache[ProfileLoaderKey, *entity.Profile]()),
    dataloader.WithBatchCapacity(100),
    dataloader.WithWait(16*time.Millisecond),
)

// キャッシュなしのローダー
loader := NewProfileLoaderWithOptions(db,
    dataloader.WithCache(&dataloader.NoCache[ProfileLoaderKey, *entity.Profile]{}),
)
```

### 新しいローダーの作成

```go
// 新しいエンティティ用のローダー
type UserLoaderKey string

func (k UserLoaderKey) String() string { return string(k) }
func (k UserLoaderKey) Raw() interface{} { return string(k) }

type UserLoader struct {
    db *gorm.DB
}

func (l *UserLoader) batchLoad(ctx context.Context, keys []UserLoaderKey) []*dataloader.Result[*entity.User] {
    // ベースローダーの機能を活用
    keyStrings := make([]string, len(keys))
    for i, key := range keys {
        keyStrings[i] = string(key)
    }

    baseLoader := &BaseLoader{}
    userIDs, parseErrors := baseLoader.ParseUintKeys(keyStrings)
    if len(parseErrors) > 0 {
        return CreateErrorResults[*entity.User](keyStrings, fmt.Errorf("failed to parse user IDs"))
    }

    // データベース取得ロジック
    var users []entity.User
    if err := l.db.Where("id IN ?", userIDs).Find(&users).Error; err != nil {
        return CreateErrorResults[*entity.User](keyStrings, fmt.Errorf("failed to load users: %w", err))
    }

    // 結果マッピング
    userMap := make(map[uint]*entity.User)
    for i := range users {
        userMap[users[i].ID] = &users[i]
    }

    return CreateResultsFromMap(keyStrings, userMap, func(key string) (uint, error) {
        if id, err := strconv.ParseUint(key, 10, 32); err == nil {
            return uint(id), nil
        }
        return 0, fmt.Errorf("invalid user ID: %s", key)
    })
}

func NewUserLoader(db *gorm.DB) *dataloader.Loader[UserLoaderKey, *entity.User] {
    loader := &UserLoader{db: db}
    return dataloader.NewBatchedLoader(loader.batchLoad)
}
```

## DataLoader v7の主な機能

- **`Load`**: 単一キーのロード
- **`LoadMany`**: 複数キーのロード
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