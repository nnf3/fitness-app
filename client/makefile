# クライアント用Makefile

# ローカルIPアドレスを自動取得
LOCAL_IP := $(shell route -n get default | grep interface | awk '{print $$2}' | xargs ifconfig | grep "inet " | head -1 | awk '{print $$2}')
EXPO_PUBLIC_SERVER_IP ?= $(LOCAL_IP)
EXPO_PUBLIC_SERVER_PORT ?= 8080

# .env.localファイルを生成（expo.devから取得した環境変数を上書き）
.PHONY: env
env:
	@echo "🔧 .env.localファイルを確認中..."
	@if [ -f .env.local ]; then \
		echo "📄 既存の.env.localファイルが見つかりました。"; \
		echo "📍 現在の設定:"; \
		cat .env.local; \
		echo ""; \
		echo "🔄 サーバー設定をローカル環境で上書き中..."; \
		@echo "EXPO_PUBLIC_SERVER_IP=$(EXPO_PUBLIC_SERVER_IP)" >> .env.local; \
		@echo "EXPO_PUBLIC_SERVER_PORT=$(EXPO_PUBLIC_SERVER_PORT)" >> .env.local; \
		echo "✅ サーバー設定が上書きされました:"; \
		cat .env.local; \
	else \
		echo "📄 新しい.env.localファイルを生成中..."; \
		echo "EXPO_PUBLIC_SERVER_IP=$(EXPO_PUBLIC_SERVER_IP)" > .env.local; \
		echo "EXPO_PUBLIC_SERVER_PORT=$(EXPO_PUBLIC_SERVER_PORT)" >> .env.local; \
		echo "✅ .env.localファイルが生成されました:"; \
		cat .env.local; \
	fi

# 開発環境セットアップ
.PHONY: setup-dev
setup-dev:
	@echo "🚀 開発環境セットアップ中..."
	@echo "1️⃣ expo.devから環境変数を取得中..."
	@eas env:pull --environment development
	@echo "2️⃣ ローカルサーバー設定で上書き中..."
	@make env
	@echo "✅ 開発環境セットアップが完了しました！"
	@echo "💡 次に 'npx expo start --dev-client' を実行してください"

# EAS Buildコマンド（.env.localからEXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_IDのみ読み込み）
.PHONY: build-ios-dev
build-ios-dev:
	@echo "🍎 iOS Development Buildを作成中..."
	@if [ -f .env.local ]; then \
		echo "📄 .env.localファイルからEXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_IDを読み込み中..."; \
		export EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID=$$(grep EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID .env.local | cut -d '=' -f2); \
		eas build --platform ios --profile development; \
	else \
		echo "❌ .env.localファイルが見つかりません。先に 'make setup-dev' を実行してください。"; \
		exit 1; \
	fi

.PHONY: build-android-dev
build-android-dev:
	@echo "🤖 Android Development Buildを作成中..."
	@if [ -f .env.local ]; then \
		echo "📄 .env.localファイルからEXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_IDを読み込み中..."; \
		export EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID=$$(grep EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID .env.local | cut -d '=' -f2); \
		eas build --platform android --profile development; \
	else \
		echo "❌ .env.localファイルが見つかりません。先に 'make setup-dev' を実行してください。"; \
		exit 1; \
	fi

# デフォルトターゲット
.PHONY: help
help:
	@echo "利用可能なコマンド:"
	@echo "  make setup-dev      - 開発環境セットアップ（env:pull + env）"
	@echo "  make env            - .env.localファイルを確認/生成（expo.devから取得した環境変数を上書き）"
	@echo ""
	@echo "EAS Build:"
	@echo "  make build-ios-dev    - iOS Development Build作成（.env.localからEXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_IDを読み込み）"
	@echo "  make build-android-dev - Android Development Build作成（.env.localからEXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_IDを読み込み）"
	@echo ""
	@echo "環境変数:"
	@echo "  LOCAL_IP        - 自動取得されたローカルIP: $(LOCAL_IP)"
	@echo "  EXPO_PUBLIC_SERVER_IP    - サーバーIP: $(EXPO_PUBLIC_SERVER_IP)"
	@echo "  EXPO_PUBLIC_SERVER_PORT  - サーバーポート: $(EXPO_PUBLIC_SERVER_PORT)"