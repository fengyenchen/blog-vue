<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EditorApplication } from '../../types/editorApplication.ts'
import { getEditorApplications, editorUpdateApplicationStatus, changeUserRole } from '../../services/admin.ts'
import { getUsernameByUserId } from '../../services/users'
import { formatDate } from '../../lib/formatDate'

// 擴充原本的型別，加入前端顯示需要的 username 和 formattedDate 欄位
interface DisplayEditorApplication extends EditorApplication {
  username: string
  formattedDate: string
}

const applications = ref<DisplayEditorApplication[]>([])
const isLoading = ref(true)

const fetchApplications = async () => {
  isLoading.value = true
  try {
    const list = await getEditorApplications()
    
    applications.value = await Promise.all(
      list.map(async (app) => {
        const username = await getUsernameByUserId(app.user_id)
        const formattedDate = formatDate(app.created_at)
        
        return {
          ...app,
          username: username || '未知使用者',
          formattedDate
        }
      })
    )
  } catch (error) {
    console.error('無法取得申請列表:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReview = async (id: string, user_id: string, action: 'approve' | 'reject') => {
  const confirmMsg = action === 'approve' ? '確定要通過此編輯者申請？' : '確定要拒絕此申請？'
  if (!confirm(confirmMsg)) return

  try {
    if (action === 'approve') {
      await editorUpdateApplicationStatus(id, 'approved')
      await changeUserRole(user_id, 'editor')
    } else {
      await editorUpdateApplicationStatus(id, 'rejected')
    }
    applications.value = applications.value.filter(app => app.id !== id)
  } catch (error) {
    alert('操作失敗，請稍後再試')
  }
}

onMounted(() => {
  fetchApplications()
})
</script>

<template>
  <section class="dashboard p-6 max-w-5xl mx-auto">
    <div class="flex md:flex-row flex-col justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 class="text-2xl font-bold text-primary">儀表板</h1>
      <div class="flex items-center space-x-3">
        <button 
          class="bg-primary text-white border border-primary px-4 py-2 transition cursor-pointer hover:bg-primary/90 rounded"
        >
          設定
        </button>
        <RouterLink 
          to="/" 
          class="bg-white text-gray-600 border border-gray-300 font-medium px-4 py-2 transition cursor-pointer hover:bg-gray-50 rounded"
        >
          登出
        </RouterLink>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          <span>編輯者申請審核</span>
          <div v-if="applications.length > 0" class="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {{ applications.length }}
          </div>
        </h2>
      </div>

      <div v-if="isLoading" class="text-center py-8 text-gray-400">
        載入申請列表中...
      </div>

      <div v-else-if="applications.length === 0" class="bg-gray-50 border border-dashed border-gray-200 rounded p-8 text-center text-gray-500 text-sm">
        目前沒有待處理的編輯者申請。
      </div>

      <div v-else>
        <div class="block md:hidden space-y-4">
          <div 
            v-for="app in applications" 
            :key="app.id" 
            class="bg-white border border-gray-200 rounded p-4 shadow-sm"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold text-gray-800">{{ app.username }}</span>
              <span class="text-gray-400 text-xs">{{ app.formattedDate }}</span>
            </div>
            
            <div class="text-gray-600 text-sm mb-4 bg-gray-50 p-2.5 rounded">
              <div class="text-xs font-semibold text-gray-400 mb-1">備註：</div>
              {{ app.remark || '-' }}
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="handleReview(app.id, app.user_id, 'approve')"
                class="bg-primary hover:bg-primary/90 text-white py-2 rounded text-sm font-medium transition cursor-pointer text-center"
              >
                同意
              </button>
              <button 
                @click="handleReview(app.id, app.user_id, 'reject')"
                class="bg-white hover:bg-gray-50 text-primary border border-primary py-2 rounded text-sm font-medium transition cursor-pointer text-center"
              >
                拒絕
              </button>
            </div>
          </div>
        </div>

        <div class="hidden md:block bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <th class="p-4 w-32">申請人</th>
                <th class="p-4">備註</th>
                <th class="p-4 w-32">申請時間</th>
                <th class="p-4 w-40 text-center">操作審核</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50/70 transition">
                <td class="p-4 font-bold text-gray-800">
                  {{ app.username }}
                </td>
                
                <td class="p-4 text-gray-600 max-w-md">
                  {{ app.remark || '未填寫理由' }}
                </td>
                
                <td class="p-4 text-gray-400 text-xs">
                  {{ app.formattedDate }}
                </td>
                
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="handleReview(app.id, app.user_id, 'approve')"
                      class="bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                    >
                      同意
                    </button>
                    <button 
                      @click="handleReview(app.id, app.user_id, 'reject')"
                      class="bg-white hover:bg-gray-50 text-primary border border-primary px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer"
                    >
                      拒絕
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