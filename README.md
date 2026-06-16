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
│   │   ├── auth.js      # 身分驗證 API 路由
│   │   └── posts.js     # 文章 API 路由
│   │   └── editor.js    # 編輯者 API 路由
│   │   └── admin.js     # 管理員 API 路由
│   ├── types/           # 後端型別或定義
│   └── index.js         # Express 入口
├── src/
│   ├── assets/          # 前端靜態資源
|   |   ├── style /
│   │   │   ├── markdown.css # 自訂 Markdown 樣式
│   ├── components/      # 共用元件
|   |   ├── Back.vue
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
│   │   └── admin.ts     # 管理員服務
│   │   └── editor.ts    # 編輯者服務
│   ├── types/           # TypeScript 型別定義
│   │   ├── auth.ts      # 登入相關型別
│   │   └── post.ts      # 文章相關型別
│   ├── views/
│   │   ├── admin/       # 後台頁面
│   │   │   ├── AdminLoginView.vue # 管理員登入頁面
│   │   │   ├── Dashboard.vue # 管理員儀表板頁面
│   │   │   ├── EditorView.vue # 編輯者管理頁面
│   │   │   ├── EditFormView.vue # 編輯者編輯頁面
│   │   │   └── LoginView.vue # 編輯者登入頁面
│   │   └── frontend/    # 前台頁面
│   │       ├── HomeView.vue
│   │       └── PostView.vue
│   ├── App.vue          # 根元件
│   ├── main.ts          # Vue 入口檔
│   └── style.css        # 全域樣式與 Tailwind 匯入
├── index.html
├── .env.exmaple         # 環境變數範例檔
├── .env                 # 本地環境變數設定檔
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

好的，完全依照你原本的簡潔格式，將所有新增的路由與模組全部補齊進去。你可以直接複製這段去替換 README：

### 5. API 預設路由

#### 身分驗證模組

* `POST /api/auth`：使用者登入驗證。需在 body 帶入 `{ username, password }`。驗證成功回傳 `200` 與使用者資訊，失敗回傳 `401`。

#### 文章模組

* `GET /api/health`：檢查 API 是否啟動（例如：`http://localhost:3000/api/health`）
* `GET /api/posts`：取得所有已發布的文章列表（狀態為 `published`，依時間降冪排序）
* `GET /api/posts/post/:id`：取得單篇已發布文章的詳細內容（例如：`http://localhost:3000/api/posts/post/550e8400-e29b-41d4-a716-446655440000`）

#### 使用者管理模組

* `GET /api/users`：取得系統所有使用者列表（包含 ID、名稱與角色）
* `GET /api/users/:id`：透過 ID 取得指定使用者的名稱與基本資料

#### 後台編輯者管理模組

* `GET /api/editor`：取得後台全文章列表（包含草稿與已發布，依時間降冪排序）
* `GET /api/editor/edit/:id`：取得單一文章詳細內容
* `POST /api/editor/edit`：儲存新增的文章。需在 body 帶入 `{ title, content, status, cover_image, excerpt }`
* `PUT /api/editor/edit/:id`：儲存更新的文章。需在 body 帶入 `{ title, content, status, cover_image, excerpt }`，並自動更新 `updated_at`
* `DELETE /api/editor/edit/:id`：刪除指定文章

#### 後台管理員權限模組

* `GET /api/admin/editor-applications`：取得所有編輯者資格申請紀錄
* `GET /api/admin/editor-applications/pending`：僅取得處於「待審核（`pending`）」狀態的編輯者申請
* `PUT /api/admin/editor-applications/:id/:status`：審核編輯者申請，變更狀態為 `approved` 或 `rejected`
* `POST /api/admin/users/:userId/:role`：調整指定使用者的權限角色（`user` / `editor` / `admin`）


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

### 10. 資料庫結構 (Database Schema)

本專案使用 PostgreSQL，核心資料表包含 `users`、`posts` 與 `editor_applications`。初始化時請使用 `init.sql` 建立資料表，各資料表核心欄位說明如下：

- **public.users**：儲存使用者帳號、密碼雜湊值（password_hash）與權限角色（role，包含 user / editor / admin）。
- **public.posts**：儲存文章標題、Markdown 原文內容（content）、文章摘要、封面圖、發布狀態（status）以及建立與更新時間。
- **public.editor_applications**：儲存一般使用者申請編輯者的申請紀錄，包含申請理由（remark）與審核狀態（status）。
