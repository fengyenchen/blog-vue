<script setup lang="ts">
import EditorApplication from '../../components/EditorApplication.vue'
import AdjustUserRoles from '../../components/AdjustUserRoles.vue'
import SetPostStatus from '../../components/SetPostStatus.vue'

</script>

<template>
  <section class="dashboard p-6 max-w-5xl mx-auto">
    <div class="flex md:flex-row flex-col justify-between items-center mb-6 space-y-4 md:space-y-0">
      <h1 class="text-2xl font-bold text-primary">儀表板</h1>
      <div class="flex items-center space-x-3">
        <!-- <button 
          class="bg-primary text-white border border-primary px-4 py-2 transition cursor-pointer hover:bg-primary/90 rounded"
        >
          設定
        </button> -->
        <RouterLink 
          to="/" 
          class="bg-white text-gray-600 border border-gray-300 font-medium px-4 py-2 transition cursor-pointer hover:bg-gray-50 rounded"
        >
          登出
        </RouterLink>
      </div>
    </div>

    <!-- 編輯者申請 -->
    <EditorApplication />

    <!-- 調整使用者權限 -->
    <AdjustUserRoles />

    <!-- 調整文章狀態 -->
    <SetPostStatus />

  </section>
</template>