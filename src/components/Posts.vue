<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../types/post.ts'
import { fetchPosts, visiblePostIds } from '../services/posts'

const allPosts = ref<Post[]>([])

const items = computed(() =>
  allPosts.value.filter((post) => visiblePostIds.value.includes(post.id)),
)

const router = useRouter()

const load = async () => {
  allPosts.value = await fetchPosts()
}

const openPost = (id: string) => {
  router.push({ name: 'post', params: { id } })
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
</script>

<template>
  <section class="posts">
    <ul>
      <li v-for="item in items" :key="item.id" class="post-item border-b border-primary py-4 px-8 cursor-pointer transition" @click="openPost(item.id)">
        <h4 class="text-lg font-bold text-primary">{{ item.title }}</h4>
        <p v-if="item.excerpt" class="text-gray-600">{{ item.excerpt }}</p>
        <small class="text-gray-400">{{ formatDate(item.created_at) }}</small>
      </li>
    </ul>
  </section>
</template>