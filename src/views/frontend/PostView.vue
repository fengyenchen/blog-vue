<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Post } from '../../types/post.ts'
import { getPostById } from '../../services/posts'
import { marked } from 'marked'
import BackToTop from '../../components/BackToTop.vue'
import Back from '../../components/Back.vue'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id || '')

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')
const showImage = ref(true)
const renderedContent = computed(() => {
  if (!post.value) {
    return ''
  }

  return marked.parse(post.value.content)
})

const load = async () => {
  try {
    if (!id) {
      error.value = 'Invalid post id'
      return
    }

    const p = await getPostById(id)
    if (!p) {
      error.value = '文章不存在或已下架'
      return
    }

    post.value = p
    showImage.value = true
  } catch (e) {
    console.error(e)
    error.value = '載入文章失敗'
  } finally {
    loading.value = false
  }
}

onMounted(load)

const formatDate = (iso?: string) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

const goHome = () => router.push({ name: 'home' })
</script>

<template>
  <section class="post-view max-w-3xl mx-auto p-6">
    <Back />

    <div v-if="loading" class="text-center py-12">載入中…</div>

    <div v-else-if="error" class="text-center text-red-600 py-12">
      <p>{{ error }}</p>
      <button @click="goHome" class="mt-8 px-3 py-1 bg-primary text-white transition cursor-pointer">回到首頁</button>
    </div>

    <article v-else v-if="post" class="prose prose-lg">
      <img v-if="post.cover_image && showImage" :src="post.cover_image" :alt="post.title ?? '文章封面'" @error="showImage = false" class="w-full rounded mb-4" />
      <h1 class="text-2xl font-bold text-primary">{{ post.title }}</h1>
      <div class="text-sm text-gray-500 mb-4">作者：{{ post.author }} · {{ formatDate(post.created_at) }}</div>
      <div v-html="renderedContent" />
    </article>

    <BackToTop />
  </section>
</template>
