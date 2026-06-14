<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import '../../assets/style/markdown.css'
import { getEditorPostById, createArticle, updateArticle } from '../../services/editor.ts'

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

// 取得網址上的 id。如果是 /edit/new，postId 就會是 undefined
const postId = computed(() => route.params.id as string | undefined)

// 表單綁定的响应式資料
const currentArticle = ref({
  title: '',
  content: '',
  excerpt: '' as string | null,
  cover_image: '' as string | null,
  status: 'draft' as 'draft' | 'published'
})

// 初始化：判斷是「編輯」還是「新增」
onMounted(async () => {
  // 如果網址有 id 且不是全新的路徑，代表是編輯狀態
  if (postId.value && route.name !== 'EditorPostCreate') {
    isLoading.value = true
    try {
      const post = await getEditorPostById(postId.value)
      if (post) {
        currentArticle.value = {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          cover_image: post.cover_image,
          status: post.status
        }
      } else {
        alert('找不到該文章')
        router.push('/edit')
      }
    } catch (error) {
      alert('載入文章詳細內容失敗')
      router.push('/edit')
    } finally {
      isLoading.value = false
    }
  }
})

// 即時將 Markdown 轉換為 HTML
const parsedMarkdown = computed(() => {
  return marked.parse(currentArticle.value.content || '')
})

// 儲存文章（新增或更新）
const saveArticle = async () => {
  if (!currentArticle.value.title.trim()) {
    alert('請填寫文章標題！')
    return
  }

  try {
    const { title, content, status, cover_image, excerpt } = currentArticle.value
    const finalCoverImage = cover_image?.trim() ? cover_image.trim() : null
    const finalExcerpt = excerpt?.trim() ? excerpt.trim() : null

    if (!postId.value) {
        // 新增文章
        await createArticle(title, content, status, finalCoverImage, finalExcerpt)
    } else {
        // 更新文章
        await updateArticle(postId.value, title, content, status, finalCoverImage, finalExcerpt)
    }
    
    // 💡 不管是新增還是更新、草稿還是公開，一律只跳「完成」
    alert('完成')
    
    // 成功後導回列表主頁
    router.push('/edit')
    } catch (error) {
    alert(error instanceof Error ? error.message : '儲存失敗')
    }
}

// 取消編輯 -> 導回列表主頁
const cancelEdit = () => {
  if (confirm('確定要取消嗎？未儲存的變更將會遺失。')) {
    router.push('/edit')
  }
}
</script>

<template>
  <section class="edit-form-view p-4 md:p-6 max-w-5xl mx-auto">
    
    <div v-if="isLoading" class="text-center py-12 text-gray-400">
      正在從資料庫讀取文章內容...
    </div>

    <div v-else class="markdown-editor-section flex flex-col h-auto md:h-[calc(100vh-140px)]">
      
      <div class="flex flex-wrap md:flex-nowrap items-center gap-3 md:space-x-4 mb-3">
        <input 
          v-model="currentArticle.title" 
          type="text" 
          placeholder="請輸入文章標題..." 
          class="w-full md:flex-1 border border-gray-300 rounded px-4 py-2 text-lg md:text-xl focus:outline-none focus:border-primary bg-white"
        />
        
        <div class="flex items-center space-x-2 w-full md:w-auto">
          <select 
            v-model="currentArticle.status" 
            class="flex-1 md:flex-none border border-gray-300 rounded px-3 py-2 bg-white text-gray-700 text-sm focus:outline-none"
          >
            <option value="draft">草稿 (Draft)</option>
            <option value="published">公開 (Published)</option>
          </select>

          <button 
            @click="saveArticle" 
            class="bg-primary hover:bg-primary/90 text-white px-4 md:px-5 py-2 rounded font-medium transition shadow cursor-pointer text-sm"
          >
            儲存
          </button>
          <button 
            @click="cancelEdit" 
            class="border border-gray-300 text-gray-600 hover:bg-gray-100 px-4 md:px-5 py-2 rounded font-medium transition bg-white cursor-pointer text-sm"
          >
            取消
          </button>
        </div>
      </div>

      <div class="mb-3">
        <input 
          v-model="currentArticle.excerpt" 
          type="text" 
          placeholder="請輸入摘要 (選填)..." 
          class="w-full border border-gray-300 rounded px-4 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
        />
      </div>

      <div class="mb-4">
        <input 
          v-model="currentArticle.cover_image" 
          type="text" 
          placeholder="請輸入封面圖片網址 (選填)..." 
          class="w-full border border-gray-300 rounded px-4 py-1.5 text-sm focus:outline-none focus:border-primary bg-white"
        />
      </div>

      <div class="flex flex-col md:flex-row flex-1 border border-gray-300 rounded overflow-hidden bg-white shadow-sm min-h-[500px] md:min-h-0">
        
        <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col min-h-[250px] md:min-h-0">
          <textarea
            v-model="currentArticle.content"
            placeholder="請使用 Markdown 語法撰寫內容..."
            class="w-full flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed min-h-[250px] md:min-h-0"
          ></textarea>
        </div>

        <div class="w-full md:w-1/2 p-4 overflow-y-auto bg-gray-50 markdown-body min-h-[250px] md:min-h-0">
          <img 
            v-if="currentArticle.cover_image" 
            :src="currentArticle.cover_image" 
            alt="Cover Preview" 
            class="w-full max-h-48 object-cover rounded mb-4"
          />
          <div v-html="parsedMarkdown"></div>
        </div>

      </div>
    </div>

  </section>
</template>