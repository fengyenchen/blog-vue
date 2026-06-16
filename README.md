# Blog-Vue

個人部落格。前台提供文章閱讀介面，後台提供文章管理與 Markdown 編輯體驗。

---

## 核心特色

- **快速開發**：使用 Vite 建立開發環境，支援快速啟動與熱更新。
- **Vue 3 架構**：以 Vue 3 Single File Components (SFC) 撰寫頁面與元件。
- **Tailwind CSS**：透過 `@tailwindcss/vite` 整合 Tailwind CSS 進行現代化切版。
- **多角色權限控制 (RBAC)**：嚴格劃分 `user` (一般讀者)、`editor` (文章編輯者)、`admin` (最高管理員) 三種角色權限。
- **全域路由守衛 (Route Guards)**：採用全域前置守衛攔截非法請求，防止未授權訪客或權限不足之角色透過手動輸入網址強行進入後台。
- **Markdown 編輯**：後台整合 `md-editor-v3`，提供 Markdown 編輯與雙欄即時預覽；文章正文會以 Markdown 原文儲存在資料庫。
- **前後台頁面分離**：`src/views/frontend` 存放前台公開頁面，`src/views/admin` 存放後台管理頁面。
- **Node.js API**：`server/` 提供 Express + PostgreSQL 後端，前端透過 `/api` 取得文章與驗證資料。

---

## 專案結構

```text
blog-vue/
├── .vscode/             # VS Code 專案建置與設定
├── dist/                # 前端打包後的正式環境產出物
├── node_modules/        # 專案依賴套件套件庫
├── public/              # 公開靜態資源
├── server/
│   ├── db/
│   │   └── pool.js      # PostgreSQL 連線池
│   ├── routes/
│   │   ├── admin.js     # 管理員 API 路由
│   │   ├── auth.js      # 身分驗證 API 路由
│   │   ├── editor.js    # 編輯者 API 路由
│   │   ├── posts.js     # 文章 API 路由
│   │   └── users.js     # 使用者管理 API 路由
│   ├── types/           # 後端型別定義資料夾
│   └── index.js         # Express 後端主入口
├── src/
│   ├── assets/          # 前端靜態資源
│   │   └── style/
│   │       └── markdown.css # 自訂 Markdown 樣式
│   ├── components/      # 前端共用元件
│   │   ├── AdjustUserRoles.vue   # 調整使用者權限元件
│   │   ├── Back.vue              # 返回上一頁元件
│   │   ├── BackToTop.vue         # 回到頂部元件
│   │   ├── EditorApplication.vue # 編輯者申請資料元件
│   │   ├── Navbar.vue            # 全站導覽列元件
│   │   ├── Posts.vue             # 文章列表元件
│   │   ├── SearchPosts.vue       # 搜尋文章元件
│   │   └── SearchUsers.vue       # 搜尋使用者元件
│   ├── lib/             # 前端共用工具函式 (utils)
│   │   ├── formatDate.ts         # 日期格式化工具
│   │   └── markdown.ts           # Markdown 解析工具
│   ├── router/
│   │   └── index.ts     # Vue Router 路由配置與全域路由守衛
│   ├── services/        # 負責與後端 API 對接的非同步請求服務
│   │   ├── admin.ts     # 管理員服務
│   │   ├── auth.ts      # 登入驗證服務
│   │   ├── editor.ts    # 編輯者服務
│   │   ├── posts.ts     # 文章資料服務
│   │   └── users.ts     # 使用者資料服務
│   ├── types/           # 前端 TypeScript 型別定義
│   │   ├── auth.ts              # 驗證與用戶角色相關型別
│   │   ├── editorApplication.ts # 編輯者申請相關型別
│   │   └── post.ts              # 文章結構相關型別
│   ├── views/
│   │   ├── admin/       # 後台管理頁面
│   │   │   ├── AdminLoginView.vue # 最高管理員登入
│   │   │   ├── Dashboard.vue      # 管理員主儀表板
│   │   │   ├── EditFormView.vue   # 文章新增/編輯表單頁面
│   │   │   ├── EditorView.vue     # 編輯者專屬管理後台
│   │   │   └── LoginView.vue      # 編輯者登入
│   │   └── frontend/    # 前台公開頁面
│   │       ├── ApplyForEditorView.vue # 申請成為編輯者頁面
│   │       ├── HomeView.vue           # 部落格首頁
│   │       └── PostView.vue           # 單篇文章詳細閱讀頁
│   ├── App.vue          # 應用程式根元件
│   ├── main.ts          # Vue 專案啟動入口檔 (TypeScript)
│   └── style.css        # 全域樣式與 Tailwind 核心配置
├── index.html           # 前端單頁網頁 (SPA) 模板入口
├── .env                 # 本地環境變數設定檔 (已加入 .gitignore)
├── .env.example         # 環境變數設定範例模板
├── .gitignore           # Git 忽略檔案清單
├── init.sql             # PostgreSQL 資料庫初始化建表腳本
├── package-lock.json    # 精確鎖定套件版本紀錄檔
├── package.json         # 專案套件依賴與 npm scripts 指令配置
├── README.md            # 專案說明文件
├── tsconfig.app.json    # 前端應用程式 TS 設定
├── tsconfig.json        # TypeScript 主設定檔
├── tsconfig.node.json   # Vite 環境節點 TS 設定
└── vite.config.ts       # Vite 核心建置與軟體外掛設定
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

在專案根目錄建立 `.env` 檔案並設定環境變數：

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/blog_vue
```

### 4. 啟動前後端開發伺服器

```bash
npm run dev
```

這個指令會同時啟動 Vite 前端與 Express API 伺服器。

---

## API 預設路由

### 身分驗證模組

* `POST /api/auth`：使用者登入驗證。需在 body 帶入 `{ username, password }`。驗證成功回傳 `200` 與使用者資訊，失敗回傳 `401`。

### 文章模組

* `GET /api/health`：檢查 API 是否啟動。
* `GET /api/posts`：取得所有已發布的文章列表（狀態為 `published`，依時間降冪排序）。
* `GET /api/posts/post/:id`：取得單篇已發布文章的詳細內容。

### 使用者管理模組

* `GET /api/users`：取得系統所有使用者列表（包含 ID、名稱與角色）。
* `GET /api/users/:id`：透過 ID 取得指定使用者的名稱與基本資料。

### 後台編輯者管理模組

* `GET /api/editor`：取得後台全文章列表（包含草稿與已發布，依時間降冪排序）。
* `GET /api/editor/edit/:id`：取得單一文章詳細內容。
* `POST /api/editor/edit`：儲存新增的文章。需在 body 帶入 `{ title, content, status, cover_image, excerpt }`。
* `PUT /api/editor/edit/:id`：儲存更新的文章。需在 body 帶入 `{ title, content, status, cover_image, excerpt }`，並自動更新 `updated_at`。
* `DELETE /api/editor/edit/:id`：刪除指定文章。

### 後台管理員權限模組

* `GET /api/admin/editor-applications`：取得所有編輯者資格申請紀錄。
* `GET /api/admin/editor-applications/pending`：僅取得處於「待審核（`pending`）」狀態的編輯者申請。
* `PUT /api/admin/editor-applications/:id/:status`：審核編輯者申請，變更狀態為 `approved` 或 `rejected`。
* `POST /api/admin/users/:userId/:role`：調整指定使用者的權限角色（`user` / `editor` / `admin`）。

---

## 身分驗證與路由安全機制 (RBAC)

本專案實作了嚴格的前後台角色分離防禦機制，核心邏輯如下：

1. **憑證管理**：使用者登入成功後，前端會將身分識別（`user_id`）與權限類別（`role`）寫入本地 `localStorage`（對應為 `token` 與 `role`）。
2. **全域前置守衛 (`router.beforeEach`)**：
* **無權限攔截**：一般未登入的 `user` (訪客) 嘗試透過網址直接訪問後台管理（`/admin` 或 `/editor`）時，守衛會自動識別目標路徑，精確重導向至對應的登入頁面（`LoginView` 或 `AdminLoginView`）。
* **越權攔截**：已登入的角色若企圖跨越權限界線（例如 `editor` 試圖進入 `/admin/dashboard`），守衛將彈出「權限不足」提示，並自動將其彈回所屬的合法操作區域。
* **強制登出分離**：為了落實「後台人員需先登出才能回到前台」的專屬設計，當已登入的 `admin` 或 `editor` 主動切換至不需要驗證的公開頁面（如首頁 `home`、申請頁 `applyForEditor` 或登入頁）時，守衛會自動清除 `localStorage` 中的身分憑證，確保其以乾淨的普通訪客狀態回歸前台。

---

## 文章資料格式

* 後台編輯器輸入與調整之正文皆為 Markdown 格式。
* 資料庫的 `public.posts.content` 欄位完整儲存 Markdown 原文字串。
* 前台文章頁面（`PostView.vue`）渲染時，前端會透過轉換套件將 Markdown 原文即時編譯為語意化 HTML 結構，並套用 `src/assets/style/markdown.css` 進行排版美化。

---

## 資料庫結構

本專案使用 PostgreSQL 作為基礎架構，核心資料表包含 `users`、`posts` 與 `editor_applications`。初始化時請使用 `init.sql` 建立資料表，各資料表核心欄位說明如下：

* **public.users**：儲存使用者帳號、密碼雜湊值（`password_hash`）與權限角色（`role`，包含 `user` / `editor` / `admin`）。
* **public.posts**：儲存文章標題、Markdown 原文內容（`content`）、文章摘要、封面圖、發布狀態（`status`：`draft` 或 `published`）以及建立與更新時間。
* **public.editor_applications**：儲存一般使用者申請編輯者的申請紀錄，包含申請理由（`remark`）與審核狀態（`status`：`pending` / `approved` / `rejected`）。

---

## 建置與部署

### 建置正式版本

```bash
npm run build
```

### 預覽正式版本

```bash
npm run preview
```

---

## 相關連結

* **GitHub 儲存庫**：[https://github.com/fengyenchen/blog-vue](https://github.com/fengyenchen/blog-vue)