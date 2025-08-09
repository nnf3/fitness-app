package main

import (
	"app/data"
	"app/db"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func main() {
	// コマンドライン引数の解析
	var (
		seed   = flag.Bool("seed", false, "初期データを登録する")
		remove = flag.Bool("remove", false, "初期データを削除する")
	)
	flag.Parse()

	// データベースに接続
	db.ConnectDB()

	// 現在のディレクトリを取得
	currentDir, err := os.Getwd()
	if err != nil {
		log.Printf("❌ 現在のディレクトリの取得に失敗しました: %v", err)
		os.Exit(1)
	}

	// YAMLファイルのパスを構築
	yamlPath := filepath.Join(currentDir, "data", "initial_exercises.yaml")

	// アクションの実行
	if *seed {
		if err := data.SeedInitialExercises(db.DB, yamlPath); err != nil {
			log.Printf("❌ 初期データの登録に失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ 初期データの登録が完了しました")
	} else if *remove {
		if err := data.RemoveInitialExercises(db.DB, yamlPath); err != nil {
			log.Printf("❌ 初期データの削除に失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ 初期データの削除が完了しました")
	} else {
		fmt.Println("❌ アクションを指定してください")
		fmt.Println("使用例: ./seed -seed")
		fmt.Println("使用例: ./seed -remove")
		os.Exit(1)
	}
}
