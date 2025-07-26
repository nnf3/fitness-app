# クライアント用Makefile

# ローカルIPアドレスを自動取得
LOCAL_IP := $(shell route -n get default | grep interface | awk '{print $$2}' | xargs ifconfig | grep "inet " | head -1 | awk '{print $$2}')
EXPO_PUBLIC_SERVER_IP ?= $(LOCAL_IP)
EXPO_PUBLIC_SERVER_PORT ?= 8080

# .env.localファイルを生成
.PHONY: env
env:
	@echo "🔧 .env.localファイルを確認中..."
	@if [ -f .env.local ]; then \
		echo "📄 既存の.env.localファイルが見つかりました。既存の値を保持します。"; \
		echo "📍 現在の設定:"; \
		cat .env.local; \
		echo ""; \
		echo "💡 上書きする場合は 'make env-force' を実行してください"; \
	else \
		echo "📄 新しい.env.localファイルを生成中..."; \
		echo "EXPO_PUBLIC_SERVER_IP=$(EXPO_PUBLIC_SERVER_IP)" > .env.local; \
		echo "EXPO_PUBLIC_SERVER_PORT=$(EXPO_PUBLIC_SERVER_PORT)" >> .env.local; \
		echo "✅ .env.localファイルが生成されました:"; \
		cat .env.local; \
	fi

# .env.localファイルを強制上書き
.PHONY: env-force
env-force:
	@echo "⚠️  .env.localファイルを強制上書き中..."
	@echo "EXPO_PUBLIC_SERVER_IP=$(EXPO_PUBLIC_SERVER_IP)" > .env.local
	@echo "EXPO_PUBLIC_SERVER_PORT=$(EXPO_PUBLIC_SERVER_PORT)" >> .env.local
	@echo "✅ .env.localファイルが上書きされました:"
	@cat .env.local

# EAS環境変数としてサーバー設定を設定
.PHONY: server-secret
server-secret:
	@echo "🔧 サーバー設定のEAS環境変数を設定中..."
	@echo "💡 現在の設定: IP=$(EXPO_PUBLIC_SERVER_IP), PORT=$(EXPO_PUBLIC_SERVER_PORT)";
	@read -p "続行しますか？ (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		eas env:create --scope project --name EXPO_PUBLIC_SERVER_IP --value "$(EXPO_PUBLIC_SERVER_IP)"; \
		eas env:create --scope project --name EXPO_PUBLIC_SERVER_PORT --value "$(EXPO_PUBLIC_SERVER_PORT)"; \
		echo "✅ サーバー設定のEAS環境変数が設定されました。"; \
	else \
		echo "❌ キャンセルされました。"; \
	fi

# デフォルトターゲット
.PHONY: help
help:
	@echo "利用可能なコマンド:"
	@echo "  make env        - .env.localファイルを確認/生成（既存ファイルは保持）"
	@echo "  make env-force  - .env.localファイルを強制上書き"
	@echo ""
	@echo "EAS環境変数設定:"
	@echo "  make server-secret               - サーバー設定をEAS環境変数に設定"
	@echo ""
	@echo "環境変数:"
	@echo "  LOCAL_IP        - 自動取得されたローカルIP: $(LOCAL_IP)"
	@echo "  EXPO_PUBLIC_SERVER_IP    - サーバーIP: $(EXPO_PUBLIC_SERVER_IP)"
	@echo "  EXPO_PUBLIC_SERVER_PORT  - サーバーポート: $(EXPO_PUBLIC_SERVER_PORT)"