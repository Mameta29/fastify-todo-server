# ベースイメージとしてNode.jsを使用
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# パッケージリストを更新し、必要なパッケージをインストール
RUN apt update && apt upgrade -y
RUN apt install -y \
      curl \
      wget \
      git \
      locales

# bashで日本語が表示されるようにする
RUN localedef -f UTF-8 -i ja_JP ja_JP
RUN echo "export LANG=ja_JP.UTF-8" >> ~/.bashrc

# pnpmのインストール
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

    
# # パッケージファイルをコピー
# COPY package*.json ./

# # 依存関係をインストール
# RUN npm install

# # アプリケーションコードをコピー
# COPY . .

# # ネイティブモジュールを再ビルド
# RUN npm rebuild bcrypt --build-from-source

# # ポートを開放
# EXPOSE 8080

# # アプリケーションを起動
# CMD ["npm", "run", "dev"]
