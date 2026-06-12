# Blog-Vue

個人部落格。前台提供文章閱讀介面，後台提供文章管理與 Markdown 編輯體驗。

---

## 核心特色

- **快速開發**：使用 Vite 建立開發環境，支援快速啟動與熱更新。
- **Vue 3 架構**：以 Vue 3 Single File Components 撰寫頁面與元件。
- **Tailwind CSS**：透過 `@tailwindcss/vite` 整合 Tailwind CSS。
- **Markdown 編輯**：後台整合 `md-editor-v3`，提供 Markdown 編輯與預覽。
- **前後台頁面分離**：`src/views/frontend` 放前台頁面，`src/views/admin` 放後台頁面。
- **Node.js API**：`server/` 提供 Express + PostgreSQL 後端，前端透過 `/api` 取得文章資料。

---

## 專案結構

```text
blog-vue/
├── public/              # 公開靜態資源
├── src/
│   ├── components/      # 共用元件
│   ├── services/        # 前端資料操作邏輯
│   ├── types/           # TypeScript 型別定義
│   ├── views/
│   │   ├── admin/       # 後台頁面
│   │   └── frontend/    # 前台頁面
│   ├── App.vue          # 根元件
│   ├── main.ts          # Vue 入口檔
│   └── style.css        # 全域樣式與 Tailwind 匯入
├── server/
│   ├── db/              # PostgreSQL 連線設定
│   ├── routes/          # API 路由
│   └── index.js         # Express 入口
├── index.html
├── package.json         # npm 套件與指令設定
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

- `GET /api/health`：檢查 API 是否啟動（例如：`http://localhost:3000/api/health`）
- `GET /api/posts`：取得已發布文章（例如：`http://localhost:3000/api/posts`）
- `GET /api/posts/:id`：取得單篇文章（例如：`http://localhost:3000/api/posts/550e8400-e29b-41d4-a716-446655440000`）


### 6. 建置正式版本

```bash
npm run build
```

### 7. 預覽正式版本

```bash
npm run preview
```