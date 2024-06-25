# ベースイメージとしてNode.jsを使用
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ネイティブモジュールを再ビルド
RUN npm rebuild bcrypt --build-from-source

# ポートを開放
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]
