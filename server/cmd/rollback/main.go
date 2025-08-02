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
		rollbackTo   = flag.String("to", "", "指定したマイグレーションIDまでロールバックする")
		rollbackLast = flag.Bool("last", false, "最後のマイグレーションをロールバックする")
	)
	flag.Parse()

	// データベースに接続
	db.ConnectDB()

	// ロールバックの実行
	if *rollbackTo != "" {
		if err := db.RollbackTo(*rollbackTo); err != nil {
			log.Printf("❌ ロールバックに失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ マイグレーション '%s' までロールバックが完了しました", *rollbackTo)
	} else if *rollbackLast {
		if err := db.RollbackLast(); err != nil {
			log.Printf("❌ ロールバックに失敗しました: %v", err)
			os.Exit(1)
		}
		log.Printf("✅ 最後のマイグレーションのロールバックが完了しました")
	} else {
		fmt.Println("❌ ロールバック対象を指定してください")
		fmt.Println("使用例: ./rollback -to 202508021519_seed_initial_workout_types")
		fmt.Println("使用例: ./rollback -last")
		os.Exit(1)
	}
}
