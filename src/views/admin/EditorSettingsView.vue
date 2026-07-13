<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { changePasswordService } from '../../services/auth'
import Back from '../../components/Back.vue'

const router = useRouter()

const password = ref('')
const newPassword = ref('')
const isValid = computed(() => password.value.trim() !== '' && newPassword.value.trim() !== '')

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    const data = await changePasswordService(password.value, newPassword.value)

    if (data.success) {
      
      
      router.push('/editor') 
    }
  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="admin-login-view max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
    <Back />
    <h1 class="text-2xl font-bold text-center mt-8">修改密碼</h1>
    <form @submit.prevent="handleSubmit" class="w-full mt-8">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">舊密碼</label>
        <input
          id="password"
          type="password"
          placeholder="請輸入舊密碼"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
          v-model="password"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="newPassword">新密碼</label>
        <input
          id="newPassword"
          type="password"
          placeholder="請輸入新密碼"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
          v-model="newPassword"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-md my-4 hover:bg-primary/90 focus:outline-none transition cursor-pointer"
        :disabled="!isValid"
      >
        送出
      </button>
    </form>
  </section>
</template>
