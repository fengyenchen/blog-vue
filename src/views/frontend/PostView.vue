<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '../../types/post.ts'
import { getPostById } from '../../services/posts'
import { getUsernameByUserId } from '../../services/posts'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import '../../assets/style/markdown.css'
import BackToTop from '../../components/BackToTop.vue'
import Back from '../../components/Back.vue'

// 建立一個屬於這個組件的、獨立且唯一的 marked 實體，不會重複疊加插件
const localMarked = new Marked(
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

const authorName = ref('未知作者')
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')
const showImage = ref(true)

// 使用剛剛建立的 localMarked
const renderedContent = computed(() => {
  if (!post.value) return ''
  return localMarked.parse(post.value.content)
})

// 動態接收 id
const load = async (currentId: string) => {
  try {
    loading.value = true
    error.value = ''
    if (!currentId) {
      error.value = 'Invalid post id'
      return
    }

    const p = await getPostById(currentId)
    if (!p) {
      error.value = '文章不存在或已下架'
      return
    }

    post.value = p
    showImage.value = true

    if (p.user_id) {
      const u = await getUsernameByUserId(p.user_id)
      if (u && u.username) {
        authorName.value = u.username
      }
    }
  } catch (e) {
    console.error(e)
    error.value = '載入文章失敗'
  } finally {
    loading.value = false
  }
}

// 使用監聽器，當 postId 變化時（包括第一次進入頁面和重新整理），都會觸發載入文章資料的函式
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      load(String(newId))
    }
  },
  { immediate: true }
)

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

const back = () => router.back()
</script>

<template>
  <section class="post-view max-w-3xl mx-auto p-6">
    <Back />

    <div v-if="loading" class="text-center py-12">載入中…</div>

    <div v-else-if="error" class="text-center text-red-600 py-12">
      <p>{{ error }}</p>
      <button @click="back" class="mt-8 px-3 py-1 bg-primary text-white transition cursor-pointer">回上一頁</button>
    </div>

    <article v-else v-if="post" class="prose prose-lg">
      <img v-if="post.cover_image && showImage" :src="post.cover_image" :alt="post.title ?? '文章封面'" @error="showImage = false" class="w-full rounded mb-4" />
      <h2 class="text-2xl font-bold text-primary">{{ post.title }}</h2>
      <div class="text-sm text-gray-500 mb-4">作者：{{ authorName }} · {{ formatDate(post.created_at) }}</div>
      <div v-html="renderedContent" class="markdown-body" />
    </article>

    <BackToTop />
  </section>
</template>