# クライアント用Makefile

# ローカルIPアドレスを自動取得
LOCAL_IP := $(shell route -n get default | grep interface | awk '{print $$2}' | xargs ifconfig | grep "inet " | head -1 | awk '{print $$2}')

.PHONY: env build-ios-dev build-android-dev build-ios-prd submit-ios help

# .env.localファイルを生成（ローカル開発用）
env:
	@echo "🔧 .env.localファイルを確認中..."
	@if [ -f .env.local ]; then \
		echo "📄 既存の.env.localファイルが見つかりました。"; \
		echo "📍 現在の設定:"; \
		cat .env.local; \
		echo ""; \
		echo "🔄 サーバー設定をローカル環境で上書き中..."; \
		sed -i '' 's/^EXPO_PUBLIC_SERVER_IP=.*/EXPO_PUBLIC_SERVER_IP=$(LOCAL_IP)/' .env.local; \
		echo "✅ サーバー設定が上書きされました:"; \
		cat .env.local; \
	else \
		echo "📄 新しい.env.localファイルを生成中..."; \
		echo "EXPO_PUBLIC_SERVER_IP=$(LOCAL_IP)" > .env.local; \
		echo "✅ .env.localファイルが生成されました:"; \
		cat .env.local; \
	fi

# EAS Buildコマンド（expo.devの環境変数を自動参照）
build-ios-dev:
	@echo "🍎 iOS Development Buildを作成中..."
	eas build --platform ios --profile development

build-android-dev:
	@echo "🤖 Android Development Buildを作成中..."
	eas build --platform android --profile development

build-ios-prd:
	@echo "🍎 iOS Production Buildを作成中..."
	eas build --platform ios --profile production

submit-ios:
	@echo "🍎 iOS Production Buildを送信中..."
	eas submit --platform ios --profile production

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo "  make env            - .env.localファイルを確認/生成（ローカルサーバー設定）"
	@echo ""
	@echo "EAS Build（クラウド上でビルド、expo.devの環境変数を自動参照）:"
	@echo "  make build-ios-dev    - iOS Development Build作成"
	@echo "  make build-android-dev - Android Development Build作成"
	@echo "  make build-ios-prd    - iOS Production Build作成"
	@echo "  make submit-ios       - iOS Production Build送信"
	@echo ""
	@echo "環境変数:"
	@echo "  LOCAL_IP        - 自動取得されたローカルIP: $(LOCAL_IP)"
