<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../types/post'
import { fetchPosts, visiblePostIds } from '../services/posts'
import { editorFetchPosts } from '../services/editor'
import { formatDate } from '../lib/formatDate'

const props = withDefaults(
  defineProps<{
    isEditor?: boolean
  }>(),
  {
    isEditor: false
  }
)

const allPosts = ref<Post[]>([])
const pinnedPosts = computed(() => allPosts.value.filter((post) => post.is_pinned))

const load = async () => {
  if (props.isEditor) {
    allPosts.value = await editorFetchPosts()
    return
  }
  allPosts.value = await fetchPosts()
  allPosts.value = allPosts.value.filter((post) => post.is_disabled === false)
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
</script>

<template>
  <section class="posts">
    <p v-if="items.length === 0" class="text-center text-gray-500 py-12">目前沒有文章。</p>    

    <div v-if="pinnedPosts.length > 0">
      <ul class="pinned-posts-list">
        <li v-for="item in pinnedPosts" 
            :key="item.id" 
            @click="openPost(item.id)"
            class="post-item border-b border-l-4 border-l-primary border-gray-200 bg-blue-50/30 py-6 px-6 md:px-8 cursor-pointer transition flex flex-col gap-4 md:grid md:grid-cols-[1fr_auto] md:gap-8 items-start md:items-center hover:bg-blue-50/60">
          <div class="post-info">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="inline-flex items-center bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                TOP
              </span>
              <h2 class="text-lg font-bold text-primary">{{ item.title }}</h2>
            </div>
            <p v-if="item.excerpt" class="text-gray-600 text-sm mt-1 line-clamp-2">{{ item.excerpt }}</p>
            <small class="text-gray-400 block mt-2">{{ formatDate(item.created_at) }}</small>
          </div>
          <div class="post-action">
            <slot name="actions" :post="item"></slot>
          </div>
        </li>
      </ul>
    </div>

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
