FROM node:20-alpine

WORKDIR /app

# 安裝依賴
COPY package*.json ./
RUN npm install

# 複製源代碼
COPY . .

# 構建
RUN npm run build

# 啟動
CMD ["npm", "start"]
