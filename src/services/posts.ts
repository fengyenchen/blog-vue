import type { Post } from '../types/post'
import { ref } from 'vue'

const posts: Post[] = [
  {
    id: '2026-06-05T12:30:00Z',
    author: 'fengyenchen',
    title: '草稿：下一版功能預告',
    content:
      '<p>我正在整理下一版會加入的功能，包含更順手的編輯器、改善版搜尋，以及更清楚的文章分類。</p><p>先把想法寫下來，等功能成熟後再慢慢完成。</p>',
    excerpt: '整理下一版會加入的新功能。',
    cover_image: null,
    status: 'draft',
    created_at: '2026-06-05T12:30:00Z',
    updated_at: '2026-06-06T09:15:00Z',
  },
  {
    id: '2026-06-01T08:00:00Z',
    author: 'fengyenchen',
    title: '一個簡單的每日整理習慣',
    content:
      '<p>每天花十分鐘整理待辦、筆記和靈感，能讓工作狀態穩定很多。</p><p>重點不是做得多，而是持續讓系統保持乾淨。</p>',
    excerpt: '每天十分鐘整理待辦與筆記。',
    cover_image: null,
    status: 'published',
    created_at: '2026-06-01T08:00:00Z',
    updated_at: '2026-06-01T08:00:00Z',
  },
  {
    id: '2026-05-20T16:45:00Z',
    author: 'fengyenchen',
    title: '我是怎麼整理寫作流程的',
    content:
      '<p>我通常會先把主題拆成三段：觀點、例子和結論，這樣寫起來不容易發散。</p><p>先完成粗稿，再回頭修標題、段落與語氣，效率會高很多。</p>',
    excerpt: '分享我規劃、起稿和發布文章的方法。',
    cover_image: '/assets/covers/organize.jpg',
    status: 'published',
    created_at: '2026-05-20T16:45:00Z',
    updated_at: '2026-05-22T10:00:00Z',
  },
  {
    id: '2026-05-12T09:10:00Z',
    author: 'fengyenchen',
    title: '前端專案裡的資料分層',
    content:
      '<p>前端專案如果從一開始就把資料來源、狀態管理和畫面元件分開，後面維護會輕鬆很多。</p><p>像這個部落格就把文章資料放在 service，元件只負責顯示。</p>',
    excerpt: '把資料來源和畫面元件分開，維護更輕鬆。',
    cover_image: null,
    status: 'published',
    created_at: '2026-05-12T09:10:00Z',
    updated_at: '2026-05-12T09:10:00Z',
  },
  {
    id: '2026-05-03T07:25:00Z',
    author: 'fengyenchen',
    title: '寫作時我怎麼找題目',
    content:
      '<p>我會先看最近卡住的問題、剛解完的 bug，或是工作流程中最容易重複出現的步驟。</p><p>這些內容通常最容易變成有用的文章，而且也最接近真實需求。</p>',
    excerpt: '從卡住的問題和重複流程找題目。',
    cover_image: '/assets/covers/ideas.jpg',
    status: 'published',
    created_at: '2026-05-03T07:25:00Z',
    updated_at: '2026-05-03T07:25:00Z',
  },
  {
    id: '2026-04-25T18:00:00Z',
    author: 'fengyenchen',
    title: '草稿：重新整理首頁版型',
    content:
      '<p>首頁目前功能已經足夠，但版型還可以再更聚焦。下一步會考慮更清楚的標題層級與更穩定的內容節奏。</p>',
    excerpt: '重新思考首頁的版型與內容節奏。',
    cover_image: null,
    status: 'draft',
    created_at: '2026-04-25T18:00:00Z',
    updated_at: '2026-04-26T08:20:00Z',
  },
  {
    id: '2026-04-18T14:40:00Z',
    author: 'fengyenchen',
    title: '三個讓內容更好讀的小調整',
    content:
      '<p>第一是縮短每段的長度，第二是讓標題更直接，第三是把關鍵資訊放在前面。</p><p>這三個調整不複雜，但很能改善閱讀體驗。</p>',
    excerpt: '縮短段落、直接標題、先講重點。',
    cover_image: '/assets/covers/readable.jpg',
    status: 'published',
    created_at: '2026-04-18T14:40:00Z',
    updated_at: '2026-04-18T14:40:00Z',
  },
  {
    id: '2026-04-09T10:05:00Z',
    author: 'fengyenchen',
    title: '關於搜尋體驗，我在意什麼',
    content:
      '<p>搜尋不只是找得到，更重要的是回饋要夠快、結果要夠準，否則使用者很快就會放棄。</p><p>我會優先確保輸入後的反應明確，讓使用者知道目前篩出了哪些文章。</p>',
    excerpt: '搜尋體驗要快、準、回饋明確。',
    cover_image: null,
    status: 'published',
    created_at: '2026-04-09T10:05:00Z',
    updated_at: '2026-04-09T10:05:00Z',
  },
  {
    id: '2026-03-30T11:30:00Z',
    author: 'fengyenchen',
    title: '草稿：文章封面圖的使用原則',
    content:
      '<p>封面圖可以增加辨識度，但如果每篇風格太雜，反而會削弱整體一致性。</p><p>我想先定好尺寸、色調和用途，再決定要不要為每篇都配圖。</p>',
    excerpt: '先定封面圖的尺寸、色調和用途。',
    cover_image: null,
    status: 'draft',
    created_at: '2026-03-30T11:30:00Z',
    updated_at: '2026-03-31T09:00:00Z',
  },
  {
    id: '2026-03-22T08:50:00Z',
    author: 'fengyenchen',
    title: '我怎麼把想法變成草稿',
    content:
      '<p>我習慣先把想法寫成三到五個短句，再把短句擴成段落，這樣能避免一開始就陷進完美主義。</p><p>先有可讀版本，再慢慢修成可發布版本。</p>',
    excerpt: '先寫短句，再擴成段落。',
    cover_image: '/assets/covers/draft.jpg',
    status: 'published',
    created_at: '2026-03-22T08:50:00Z',
    updated_at: '2026-03-22T08:50:00Z',
  },
  {
    id: '2026-03-10T13:15:00Z',
    author: 'fengyenchen',
    title: '歡迎來到我的部落格',
    content: '<p>這是部落格的第一篇文章，先和你打聲招呼，也順便介紹這個站會記錄哪些主題。</p><p>接下來我會分享寫作、前端實作、生活整理和一些學習筆記。</p>',
    excerpt: '部落格正式開始，先和大家打聲招呼。',
    cover_image: '/assets/covers/welcome.jpg',
    status: 'published',
    created_at: '2026-03-10T13:15:00Z',
    updated_at: '2026-03-10T13:15:00Z',
  }
]

export const visiblePostIds = ref<string[]>(posts.map((post) => post.id))

export const getPosts = async () => {
  return posts.filter((post) => post.status === 'published')
}

export const getPostById = async (id: string) => {
  return getPosts().then((posts) => posts.find((post) => post.id === id) ?? null)
}

export const getPostByTitle = async (title: string) => {
  const q = title.trim().toLowerCase()
  if (!q) return getPosts().then((posts) => posts.map((post) => post.id))
  return getPosts().then((posts) => posts.filter((post) => post.title.toLowerCase().includes(q)).map((post) => post.id))
}