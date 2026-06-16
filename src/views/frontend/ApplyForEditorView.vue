<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { applyForEditorService } from '../../services/auth'
import Back from '../../components/Back.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const remark = ref('')
const isValid = computed(() => username.value.trim() !== '' && password.value.trim() !== '')

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    const data = await applyForEditorService(username.value, password.value, remark.value)

    if (data.success) {
      alert('申請成功！請等待管理員審核。')
      router.push('/')
    }
  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="apply-for-editor-view max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
    <Back />
    <h1 class="text-2xl font-bold text-center mt-8">Apply for Editor</h1>
    <form @submit.prevent="handleSubmit" class="w-full mt-8">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
          v-model="username"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
          v-model="password"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="remark">Remark</label>
        <input
          id="remark"
          type="text"
          placeholder="Enter your remark (optional)"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
          v-model="remark"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-md my-4 hover:bg-primary/90 focus:outline-none transition cursor-pointer"
        :disabled="!isValid"
      >
        apply
      </button>
    </form>
  </section>
</template>