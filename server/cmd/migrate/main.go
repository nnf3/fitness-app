package main

import (
	"app/db"
	"flag"
	"fmt"
	"log"
	"os"
)

func main() {
	// コマンドライン引数の解析
	var (
		migrateTo  = flag.String("to", "", "指定したマイグレーションIDまでマイグレーションを実行する")
		migrateAll = flag.Bool("all", false, "全てのマイグレーションを実行する")
	)
	flag.Parse()

	// データベースに接続
	db.ConnectDB()

	// マイグレーションの実行
	if *migrateTo != "" {
		if err := db.MigrateTo(*migrateTo); err != nil {
			log.Printf("❌ マイグレーションに失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ マイグレーション '%s' まで実行が完了しました", *migrateTo)
	} else if *migrateAll {
		if err := db.RunMigrations(); err != nil {
			log.Printf("❌ マイグレーションに失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ 全てのマイグレーションの実行が完了しました")
	} else {
		fmt.Println("❌ マイグレーション対象を指定してください")
		fmt.Println("使用例: ./migrate -to 202508021519_seed_initial_workout_types")
		fmt.Println("使用例: ./migrate -all")
		os.Exit(1)
	}
}
