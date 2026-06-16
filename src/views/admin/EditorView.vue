<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Posts from '../../components/Posts.vue'
import { deleteArticle } from '../../services/editor'
import type { Post } from '../../types/post'

const router = useRouter()

// 用來控制 Posts 元件刷新的計數器
const refreshKey = ref(0)

const handleCreate = () => {
  router.push('/editor/edit/new')
}

const handleEdit = (post: Post) => {
  router.push(`/editor/edit/${post.id}`)
}

// 刪除文章並二次確認
const confirmDelete = async (post: Post) => {
  if (confirm(`確定要刪除文章「${post.title}」嗎？此操作無法復原。`)) {
    try {
      await deleteArticle(post.id)
      alert('文章已成功刪除')
      
      // 刪除成功後，讓 key 增加，迫使 Posts 元件重新讀取資料庫
      refreshKey.value++ 
    } catch (error) {
      alert(error instanceof Error ? error.message : '刪除失敗')
    }
  }
}
</script>

<template>
  <section class="editor-view p-6 max-w-5xl mx-auto">
    <div class="flex md:flex-row flex-col justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 class="text-2xl font-bold text-primary">文章編輯後台</h1>
      <div class="flex items-center space-x-3">
        <button 
          class="bg-primary text-white border border-primary px-4 py-2 transition cursor-pointer hover:bg-primary/90 rounded"
        >
          設定
        </button>
        <button 
          @click="handleCreate" 
          class="bg-primary text-white border border-primary px-4 py-2 transition cursor-pointer hover:bg-primary/90 rounded"
        >
          新增文章
        </button>
        <RouterLink 
          to="/" 
          class="bg-white text-gray-600 border border-gray-300 font-medium px-4 py-2 transition cursor-pointer hover:bg-gray-50 rounded"
        >
          登出
        </RouterLink>
      </div>
    </div>

    <Posts :key="refreshKey" :isEditor="true">
      <template #actions="{ post }">
        <div class="flex items-center space-x-3">
          <span 
            v-if="post.status === 'draft'" 
            class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            草稿
          </span>
          <span 
            v-else-if="post.status === 'published'" 
            class="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full"
          >
            已發布
          </span>

          <div class="flex space-x-2">
            <button 
              @click.stop="handleEdit(post)" 
              class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-sm transition cursor-pointer"
            >
              編輯
            </button>
            <button 
              @click.stop="confirmDelete(post)" 
              class="border border-red-500 text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm transition cursor-pointer"
            >
              刪除
            </button>
          </div>
        </div>
      </template>
    </Posts>
  </section>
</template>