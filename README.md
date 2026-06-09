# Blog-Vue

個人部落格。前台提供文章閱讀介面，後台提供文章管理與 Markdown 編輯體驗。

---

## 核心特色

- **快速開發**：使用 Vite 建立開發環境，支援快速啟動與熱更新。
- **Vue 3 架構**：以 Vue 3 Single File Components 撰寫頁面與元件。
- **Tailwind CSS**：透過 `@tailwindcss/vite` 整合 Tailwind CSS。
- **Markdown 編輯**：後台整合 `md-editor-v3`，提供 Markdown 編輯與預覽。
- **前後台頁面分離**：`src/views/frontend` 放前台頁面，`src/views/admin` 放後台頁面。

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

### 3. 啟動前端開發伺服器

```bash
npm run dev
```

啟動後在瀏覽器開啟終端機顯示的本機網址。

### 4. 建置正式版本

```bash
npm run build
```

### 5. 預覽正式版本

```bash
npm run preview
```