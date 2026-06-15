<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../types/post'
import { fetchPosts, visiblePostIds } from '../services/posts'
import { editorFetchPosts } from '../services/editor'

const props = withDefaults(
  defineProps<{
    isEditor?: boolean
  }>(),
  {
    isEditor: false
  }
)

const allPosts = ref<Post[]>([])

const load = async () => {
  if (props.isEditor) {
    allPosts.value = await editorFetchPosts()
    return
  }
  allPosts.value = await fetchPosts()
}

onMounted(load)

const items = computed(() => {
  if (props.isEditor) {
    return allPosts.value
  }
  return allPosts.value.filter((post) => visiblePostIds.value.includes(post.id))
})

const router = useRouter()

const openPost = (id: string) => {
  if (props.isEditor) {
    router.push(`/editor/edit/${id}`)
    return
  }
  router.push({ name: 'post', params: { id } })
}

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
    <ul class="posts-list">
      <li v-for="item in items" 
          :key="item.id" 
          @click="openPost(item.id)"
          class="post-item border-b border-gray-200 py-6 px-6 md:px-8 cursor-pointer transition flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-8 items-start md:items-center hover:bg-gray-50/50">
        <div class="post-info">
          <h2 class="text-lg font-bold text-primary">{{ item.title }}</h2>
          <p v-if="item.excerpt" class="text-gray-600">{{ item.excerpt }}</p>
          <small class="text-gray-400">{{ formatDate(item.created_at) }}</small>
        </div>
        <div class="post-action">
          <slot name="actions" :post="item"></slot>
        </div>
      </li>
    </ul>
  </section>
</template>