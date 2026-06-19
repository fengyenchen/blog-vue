<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../types/post'
import { fetchPosts } from '../services/posts'
import { getUsernameByUserId } from '../services/users'
import { updatePostStatus } from '../services/admin'

interface ManageablePost extends Post {
  authorName?: string
  isSaving?: boolean
}

const allPosts = ref<ManageablePost[]>([])

const load = async () => {
    const rawPosts = await fetchPosts()

    allPosts.value = await Promise.all(
        rawPosts.map(async (post) => {
            const name = await getUsernameByUserId(post.user_id)
            return {
                ...post,
                authorName: name || '未知作者',
                isSaving: false
            }
        })
    )
}

onMounted(load)

const router = useRouter()

const openPost = (id: string) => {
  router.push({ name: 'post', params: { id } })
}

const savePostStatus = async (event: Event, item: ManageablePost) => {
  event.stopPropagation() // 避免觸發整列導頁
  
  item.isSaving = true
  try {
    await updatePostStatus(item.id, { 
      is_pinned: item.is_pinned,
      is_disabled: item.is_disabled 
    })
    alert('狀態更新成功！')
  } catch (error) {
    console.error('儲存文章狀態失敗:', error)
    alert('操作失敗，請稍後再試')
  } finally {
    item.isSaving = false
  }
}
</script>

<template>
  <section class="editor-application p-6 max-w-5xl mx-auto">
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-primary flex items-center gap-2">
          調整文章狀態
        </h2>
      </div>

      <div v-if="allPosts.length === 0" class="bg-gray-50 border border-dashed border-gray-200 rounded p-8 text-center text-gray-500 text-sm">
        目前尚無文章。
      </div>

      <div v-else>
        
        <div class="block md:hidden space-y-2">
          <div 
            v-for="item in allPosts" 
            :key="item.id" 
            @click="openPost(item.id)"
            class="bg-white border border-gray-200 rounded p-4 shadow-sm cursor-pointer"
          >
            <div class="mb-3 font-bold text-gray-800 text-base">
              <span :class="{ 'line-through text-gray-400': item.is_disabled }">
                {{ item.title }}
              </span>
              <div class="text-sm text-gray-400 font-normal mt-0.5">{{ item.authorName }}</div>
            </div>
            
            <div class="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
              <div class="flex gap-6 text-sm text-gray-700 flex-1">
                <label class="flex items-center gap-2 cursor-pointer" @click.stop>
                  <input 
                    type="checkbox" 
                    v-model="item.is_pinned"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  釘選
                </label>
                <label class="flex items-center gap-2 cursor-pointer" @click.stop>
                  <input 
                    type="checkbox" 
                    v-model="item.is_disabled"
                    class="w-4 h-4 rounded border-gray-300"
                  />
                  停用
                </label>
              </div>
              
              <button 
                @click="savePostStatus($event, item)"
                :disabled="item.isSaving"
                class="bg-primary hover:bg-primary/90 border border-primary text-white px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
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
                <th class="p-4">文章</th>
                <th class="p-4 w-20 text-center">釘選</th>
                <th class="p-4 w-20 text-center">停用</th>
                <th class="p-4 w-32 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-gray-700">
              <tr v-for="item in allPosts"
                :key="item.id" 
                @click="openPost(item.id)"
                class="hover:bg-gray-50/70 transition cursor-pointer">
                
                <td class="p-4 font-bold text-gray-800">
                  <h2 class="text-base font-bold text-primary" :class="{ 'line-through text-gray-400': item.is_disabled }">
                    {{ item.title }}
                  </h2>
                  <span class="text-xs text-gray-500 font-normal">{{ item.authorName }}</span>
                </td>
                
                <td class="p-4 text-center" @click.stop>
                  <input 
                    type="checkbox" 
                    v-model="item.is_pinned"
                    class="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </td>
                
                <td class="p-4 text-center" @click.stop>
                  <input 
                    type="checkbox" 
                    v-model="item.is_disabled"
                    class="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </td>
                
                <td class="p-4 text-center" @click.stop>
                  <div class="flex justify-center gap-2">
                    <button 
                      @click="savePostStatus($event, item)"
                      :disabled="item.isSaving"
                      class="bg-primary hover:bg-primary/90 border border-primary text-white px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
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