# Blog-Vue

個人部落格。前台提供文章閱讀介面，後台提供文章管理與 Markdown 編輯體驗。

---

## 核心特色

- **快速開發**：使用 Vite 建立開發環境，支援快速啟動與熱更新。
- **Vue 3 架構**：以 Vue 3 Single File Components 撰寫頁面與元件。
- **Tailwind CSS**：透過 `@tailwindcss/vite` 整合 Tailwind CSS。
- **身分驗證 (Authentication)**：後台安全登入機制，串接 PostgreSQL 資料庫進行帳密比對。
- **Markdown 編輯**：後台整合 `md-editor-v3`，提供 Markdown 編輯與預覽；文章正文會以 Markdown 原文儲存在資料庫。
- **前後台頁面分離**：`src/views/frontend` 放前台頁面，`src/views/admin` 放後台頁面。
- **Node.js API**：`server/` 提供 Express + PostgreSQL 後端，前端透過 `/api` 取得文章與驗證資料。

---

## 專案結構

```text
blog-vue/
├── public/              # 公開靜態資源
├── server/
│   ├── db/
│   │   └── pool.js      # PostgreSQL 連線池
│   ├── routes/
│   │   ├── auth.js      # 身分驗證 API 路由 🆕
│   │   └── posts.js     # 文章 API 路由
│   ├── types/           # 後端型別或定義
│   └── index.js         # Express 入口
├── src/
│   ├── assets/          # 前端靜態資源
│   ├── components/      # 共用元件
│   │   ├── BackToTop.vue
│   │   ├── Navbar.vue
│   │   ├── Posts.vue
│   │   └── Search.vue
│   ├── lib/             # 前端工具函式
│   ├── router/
│   │   └── index.ts     # Vue Router 設定
│   ├── services/        # 前端資料操作邏輯
│   │   ├── auth.ts      # 登入驗證服務
│   │   └── posts.ts     # 文章資料服務
│   ├── types/           # TypeScript 型別定義
│   │   ├── auth.ts      # 登入相關型別
│   │   └── post.ts      # 文章相關型別
│   ├── views/
│   │   ├── admin/       # 後台頁面
│   │   │   ├── AdminLoginView.vue # 管理員登入頁面
│   │   │   ├── Dashboard.vue
│   │   │   ├── EditorView.vue
│   │   │   └── LoginView.vue
│   │   └── frontend/    # 前台頁面
│   │       ├── HomeView.vue
│   │       └── PostView.vue
│   ├── App.vue          # 根元件
│   ├── main.ts          # Vue 入口檔
│   └── style.css        # 全域樣式與 Tailwind 匯入
├── index.html
├── package.json         # npm 套件與指令設定
├── README.md
├── tsconfig*.json
└── vite.config.ts       # Vite 與 Tailwind CSS 設定
```

---

## 快速開始

### 1. 安裝 Node.js

先安裝 Node.js，建議使用 LTS 版本。

### 2. 安裝專案依賴

```bash
npm install
```

### 3. 設定環境變數

在專案根目錄的 `.env` 設定 PostgreSQL 連線字串：

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/blog_vue
```

### 4. 啟動前後端開發伺服器

```bash
npm run dev
```

這個指令會同時啟動 Vite 前端與 Express API。

### 5. API 預設路由

#### 身分驗證模組

- `POST /api/auth/`：使用者登入驗證。需在 body 帶入 `{ username, password }`。驗證成功回傳 `200` 與使用者資訊，失敗回傳 `401`。

#### 文章模組

- `GET /api/health`：檢查 API 是否啟動（例如：`http://localhost:3000/api/health`）
- `GET /api/posts`：取得已發布文章（例如：`http://localhost:3000/api/posts`）
- `GET /api/posts/:id`：取得單篇文章（例如：`http://localhost:3000/api/posts/550e8400-e29b-41d4-a716-446655440000`）


### 6. 身分驗證機制

- 帳號密碼安全儲存於 PostgreSQL 的 `public.users` 資料庫中。
- 後端 `server/routes/auth.js` 透過資料庫欄位 `username` 與 `password_hash` 進行精確比對。
- 前端透過 `src/services/auth.ts` 發送非同步 POST 請求，阻斷未經授權的連線。

### 7. 文章資料格式

- 後台編輯器輸入的是 Markdown。
- 資料庫的 `public.posts.content` 欄位儲存 Markdown 原文。
- 前台文章頁會用 `marked` 將 Markdown 轉成 HTML 後再顯示。


### 8. 建置正式版本

```bash
npm run build
```

### 9. 預覽正式版本

```bash
npm run preview
```