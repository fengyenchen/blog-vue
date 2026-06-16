<script setup lang="ts">
import { ref, watch } from 'vue'
import { getAllUsers } from '../services/users'
import { visibleUsersId } from '../services/admin'
import { getUsersByUsername } from '../services/users'
import type { User } from '../types/auth.ts'

const query = ref('')

watch(
  query,
  async () => {
    if (query.value) {
        visibleUsersId.value = (await getUsersByUsername(query.value)).map((user: User) => user.id)
    } else {
        visibleUsersId.value = (await getAllUsers()).map((user: User) => user.id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="search-users flex items-center justify-between">
    <div class="search-input pb-4 flex-1">
      <input
        v-model="query"
        class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type="search"
        placeholder="搜尋使用者..."
      />
    </div>
  </section>
</template>