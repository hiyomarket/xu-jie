# 墟界技術架構文件

## 📋 專案概述

- **專案名稱**：墟界 (XuJie)
- **遊戲類型**：魔力寶貝風格半放置型網頁遊戲
- **技術棧**：NestJS + tRPC + Next.js + MySQL + Docker

---

## 🏗️ 系統架構

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Client     │────▶│   Nginx     │────▶│  Next.js    │
│  (Browser)   │     │  Reverse    │     │   :3000     │
└──────────────┘     │   Proxy     │     └──────┬───────┘
                     │   :80/443   │            │
                     └─────────────┘            │
                               │                │
                               ▼                ▼
                      ┌────────────────┐ ┌──────────────┐
                      │    Let's       │ │   NestJS     │
                      │   Encrypt      │ │   :4000      │
                      └────────────────┘ └──────┬───────┘
                                                 │
                                        ┌────────▼────────┐
                                        │   MySQL :3306   │
                                        │   xu_jie        │
                                        └─────────────────┘
```

---

## 📁 目錄結構

```
xu-jie/
├── docker-compose.yml      # Docker 部署配置
├── nginx/
│   └── nginx.conf          # Nginx 反向代理配置
├── server/                  # 後端 NestJS
│   ├── src/
│   │   ├── main.ts         # 入口
│   │   ├── app.module.ts   # 主模組
│   │   ├── auth/           # 認證模組
│   │   ├── user/           # 用戶模組
│   │   ├── pet/            # 寵物模組
│   │   ├── prisma/         # Prisma 服務
│   │   └── trpc/           # tRPC 配置
│   ├── prisma/
│   │   └── schema.prisma   # 資料庫結構
│   ├── Dockerfile
│   └── package.json
├── client/                  # 前端 Next.js
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── page.tsx    # 首頁
│   │   │   ├── auth/       # 登入/註冊
│   │   │   └── dashboard/  # 遊戲儀表板
│   │   ├── components/     # React 元件
│   │   └── lib/            # 工具函式
│   ├── Dockerfile
│   └── package.json
└── SYSTEM-DESIGN/
    └── README.md           # 本文件
```

---

## 🔧 API 設計

### 認證 API (`/api/auth`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | /auth/register | 用戶註冊 |
| POST | /auth/login | 用戶登入 |
| POST | /auth/logout | 用戶登出 |
| POST | /auth/refresh | 刷新 Token |

### 用戶 API (`/api/user`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /user/me | 取得當前用戶資訊 |
| GET | /user/profile | 取得用戶完整資料（含寵物） |

### 寵物 API (`/api/pet`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | /pet/my | 取得用戶所有寵物 |
| GET | /pet/types | 取得寵物類型列表 |
| POST | /pet/catch | 捕捉寵物 |

---

## 🗄️ 資料庫結構

### 用戶表 (User)
- id, email, username, password
- role (user/admin)
- gold (遊戲貨幣)
- level, exp

### 寵物表 (Pet)
- userId, petTypeId
- name, level, exp
- 檔數資質 (hp, mp, str, int, agi, end)
- 戰鬥屬性 (hpMax, mpMax, attack, defense, speed)
- isVariant (變異寵物)

### 寵物類型表 (PetType)
- name, element (fire/water/earth/wind)
- baseHp, baseMp, baseStr, baseInt, baseAgi, baseEnd

### 物品表 (Item)
- name, type, rarity
- effect (JSON)

### 背包表 (Inventory)
- userId, itemId, quantity

---

## 🔐 認證機制

- **JWT**: Access Token (15分鐘) + Refresh Token (7天)
- **Cookie**: httpOnly + Secure + SameSite=Strict
- **密碼加密**: bcrypt

---

## 🚀 部署流程

1. **複製專案**
   ```bash
   git clone https://github.com/hiyomarket/xu-jie.git
   cd xu-jie
   ```

2. **設定環境變數**
   ```bash
   cp server/.env.example server/.env
   # 編輯 .env 填入實際值
   ```

3. **啟動服務**
   ```bash
   docker-compose up -d
   ```

4. **初始化資料庫**
   ```bash
   docker-compose exec server npx prisma migrate dev
   ```

---

## 📝 待開發功能

- [ ] 戰鬥系統
- [ ] 抽卡/寵物召喚系統
- [ ] 商店系統
- [ ] 裝備系統
- [ ] 任務系統
- [ ] 排行榜
- [ ] WebSocket 即時戰鬥

---

*最後更新：2026-03-25*
