<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginService } from '../../services/auth'
import Back from '../../components/Back.vue'

const router = useRouter()

const username = ref('')
const password = ref('')
const isValid = computed(() => username.value.trim() !== '' && password.value.trim() !== '')

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    const data = await loginService('editor', username.value, password.value)

    if (data.success && (data.user.role === 'editor' || data.user.role === 'admin')) {
      router.push('/editor') 
    }
  } catch (error: any) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="login-view max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
    <Back />
    <h1 class="text-2xl font-bold text-center mt-8">Editor Login</h1>
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
      <button
        type="submit"
        class="w-full bg-primary/80 text-white py-2 rounded-md my-4 hover:bg-primary focus:outline-none transition cursor-pointer"
        :disabled="!isValid"
      >
        Login
      </button>
    </form>
    <div class="admin-link text-center mt-4">
      <RouterLink to="/admin/login" class="text-sm text-gray-600 transition underline hover:text-gray-800">Admin Login</RouterLink>
    </div>
  </section>
</template>