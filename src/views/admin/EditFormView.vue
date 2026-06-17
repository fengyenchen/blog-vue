<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '../../assets/style/markdown.css'
import { getEditorPostById, createArticle, updateArticle } from '../../services/editor'
import { parseMarkdown } from '../../lib/markdown'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

const postId = computed(() => route.params.id as string | undefined)

const currentArticle = ref({
  title: '',
  content: '',
  excerpt: '' as string | null,
  cover_image: '' as string | null,
  status: 'draft' as 'draft' | 'published'
})

const loadArticleData = async (id: string) => {
  isLoading.value = true
  try {
    const post = await getEditorPostById(id)
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
      router.push('/editor')
    }
  } catch (error) {
    alert('載入文章詳細內容失敗')
    router.push('/editor')
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    // 只有當不是新增文章時，才去後端撈取舊資料
    if (newId && newId !== 'new') {
      loadArticleData(String(newId))
    } else {
      currentArticle.value = {
        title: '',
        content: '',
        excerpt: '',
        cover_image: '',
        status: 'draft'
      }
    }
  },
  { immediate: true }
)

const parsedMarkdown = computed(() => {
  return parseMarkdown(currentArticle.value.content || '')
})

const saveArticle = async () => {
  if (!currentArticle.value.title.trim() || !currentArticle.value.content.trim()) {
    alert('請填寫文章標題和內容！')
    return
  }

  try {
    const { title, content, status, cover_image, excerpt } = currentArticle.value
    const finalCoverImage = cover_image?.trim() ? cover_image.trim() : null
    const finalExcerpt = excerpt?.trim() ? excerpt.trim() : null

    if (!postId.value) {
        // 新增文章
        const userId = localStorage.getItem('token') || ''
        await createArticle(userId, title, content, status, finalCoverImage, finalExcerpt)
    } else {
        // 更新文章
        const userId = localStorage.getItem('token') || ''
        const role = localStorage.getItem('role') || ''
        await updateArticle(userId, role, postId.value, title, content, status, finalCoverImage, finalExcerpt)
    }
    
    alert('完成')
    router.push('/editor')
  } catch (error) {
    alert(error instanceof Error ? error.message : '儲存失敗')
  }
}

const cancelEdit = () => {
  if (confirm('確定要取消嗎？未儲存的變更將會遺失。')) {
    router.push('/editor')
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

      <div class="flex flex-col md:flex-row flex-1 border border-gray-300 rounded overflow-hidden bg-white shadow-sm min-h-125 md:min-h-0">
        
        <div class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300 flex flex-col min-h-62.5 md:min-h-0">
          <textarea
            v-model="currentArticle.content"
            placeholder="請使用 Markdown 語法撰寫內容..."
            class="w-full flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed min-h-62.5 md:min-h-0"
          ></textarea>
        </div>

        <div class="markdown-body w-full md:w-1/2 p-4 overflow-y-auto bg-gray-50 min-h-62.5 md:min-h-0">
          <img 
            v-if="currentArticle.cover_image" 
            :src="currentArticle.cover_image" 
            alt="Cover Preview" 
            class="w-full object-cover rounded mb-4"
          />
          <span v-if="currentArticle.cover_image" class="block text-sm text-gray-500 text-center border-b border-gray-300 py-2">封面圖片預覽</span>
          <div v-html="parsedMarkdown"></div>
        </div>

      </div>
    </div>

  </section>
</template>