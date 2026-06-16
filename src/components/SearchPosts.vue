<script setup lang="ts">
import { ref, watch } from 'vue'
import { getPostByTitle, visiblePostIds } from '../services/posts'

const query = ref('')

watch(
  query,
  async (value) => {
    visiblePostIds.value = await getPostByTitle(value)
  },
  { immediate: true },
)
</script>

<template>
  <section class="search-posts flex items-center justify-between bg-bg border-y border-primary">
    <div class="search-input pl-8 pr-8 py-4 flex-1">
      <input
        v-model="query"
        class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type="search"
        placeholder="搜尋文章..."
      />
    </div>
  </section>
</template>