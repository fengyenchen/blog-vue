<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { User } from '../types/auth.ts'
import { changeUserRole, visibleUsersId } from '../services/admin.ts'
import { getAllUsers } from '../services/users.ts'
import SearchUsers from './SearchUsers.vue'

const isLoading = ref(true)
const users = ref<User[]>([])

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const data = await getAllUsers()
    users.value = data || []
  } catch (error) {
    alert('無法取得使用者列表')
  } finally {
    isLoading.value = false
  }
}

const items = computed(() => {
  if (!visibleUsersId.value) return users.value
  return users.value.filter((user) => visibleUsersId.value.includes(user.id))
})

const handleSaveRole = async (userId: string, newRole: string) => {
  try {
    await changeUserRole(userId, newRole)
    alert('權限更新成功！')
    await fetchUsers()
  } catch (error) {
    alert('操作失敗，請稍後再試')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <section class="editor-application p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          調整使用者權限
        </h2>
      </div>

      <SearchUsers />

      <div v-if="isLoading" class="text-center py-8 text-gray-400">
        載入使用者列表中...
      </div>

      <div v-else-if="items.length === 0" class="bg-gray-50 border border-dashed border-gray-200 rounded p-8 text-center text-gray-500 text-sm">
        目前尚無使用者，或找不到搜尋結果。
      </div>

      <div v-else>
        
        <div class="block md:hidden space-y-2 max-h-125 overflow-y-auto">
          <div 
            v-for="item in items" 
            :key="item.id" 
            class="bg-white border border-gray-200 rounded p-4 shadow-sm"
          >
            <div class="mb-3 font-bold text-gray-800 text-base">
              {{ item.username }}
            </div>
            
            <div class="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <select 
                v-model="item.role" 
                class="bg-white border border-gray-300 text-gray-700 px-2 py-1.5 rounded text-sm focus:outline-none focus:border-primary flex-1"
              >
                <option value="user">使用者 (user)</option>
                <option value="editor">編輯者 (editor)</option>
                <option value="admin">管理員 (admin)</option>
              </select>
              
              <button 
                @click="handleSaveRole(item.id, item.role)"
                class="bg-primary hover:bg-primary/90 border border-primary text-white px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer"
              >
                儲存
              </button>
            </div>
          </div>
        </div>

        <div class="hidden md:block bg-white border border-gray-200 rounded shadow-sm max-h-96 overflow-y-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th class="p-4">使用者名稱</th>
                <th class="p-4 w-48">調整角色</th>
                <th class="p-4 w-32 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50/70 transition">
                <td class="p-4 font-bold text-gray-800">
                  {{ item.username }}
                </td>
                
                <td class="p-4">
                  <select 
                    v-model="item.role" 
                    class="bg-white border border-gray-300 text-gray-700 px-2 py-1.5 rounded text-sm focus:outline-none focus:border-primary w-full max-w-75"
                  >
                    <option value="user">使用者 (user)</option>
                    <option value="editor">編輯者 (editor)</option>
                    <option value="admin">管理員 (admin)</option>
                  </select>
                </td>
                
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="handleSaveRole(item.id, item.role)"
                      class="bg-primary hover:bg-primary/90 border border-primary text-white px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                    >
                      儲存
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </section>
</template>