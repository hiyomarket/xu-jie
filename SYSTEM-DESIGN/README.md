# 墟界 — 系統設計文件

> 建立時間：2026/03/25 10:56 | 建立者：架站顧問

---

## 專案結構

```
xu-jie/
├── server/              # NestJS 後端
│   ├── src/
│   │   ├── auth/        # 認證模組（JWT）
│   │   ├── user/        # 用戶模組
│   │   ├── pet/         # 寵物模組
│   │   └── trpc/        # tRPC 整合
│   ├── prisma/          # Prisma ORM Schema
│   └── Dockerfile
├── client/              # Next.js 14 前端
│   ├── src/app/
│   │   ├── auth/        # 登入/註冊頁面
│   │   └── dashboard/   # 主儀表板
│   └── Dockerfile
├── nginx/               # Nginx 反向代理設定
├── docker-compose.yml   # Docker 容器編排
└── SYSTEM-DESIGN/       # 本文件
```

---

## 技術棧

| 層次 | 技術 | 狀態 |
|------|------|------|
| 前端框架 | Next.js 14 + Tailwind CSS | ✅ |
| 後端框架 | NestJS + tRPC | ✅ |
| ORM | Prisma ORM | ✅ |
| 資料庫 | MySQL 8 | ✅ |
| 認證 | JWT（Access + Refresh Token）| ✅ |
| 容器化 | Docker Compose | ✅ |
| 反向代理 | Nginx | ✅ |

---

## API 端點

### 認證
| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/auth/register` | 會員註冊 |
| POST | `/api/auth/login` | 會員登入 |

### 用戶
| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/user/me` | 取得當前用戶資訊 |

### 寵物
| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/pet/types` | 取得寵物類型列表 |
| POST | `/api/pet/catch` | 捕捉寵物 |

---

## Docker Compose 架構

```
client (Next.js)  → Port 3000
server (NestJS)   → Port 3001
mysql (Database)   → Port 3306
nginx (Proxy)      → Port 80/443
```

---

## 下一步（待 VPS 就緒後執行）

1. SSH 部署 Docker 環境
2. 初始化 MySQL 資料庫結構
3. 設定 Nginx + Let's Encrypt SSL
4. 設定網域 DNS 指向

---

## 等待事項

| 事項 | 負責人 | 狀態 |
|------|--------|------|
| Vultr VPS 申請 | Boss | ⏳ |
| 網域 xujie.io 申請 | Boss | ⏳ |
| DNS 指向設定 | 架站顧問 | ⏳ 等VPS |
| Let's Encrypt SSL | 架站顧問 | ⏳ 等VPS |

---

*最後更新：2026/03/25 10:56*
