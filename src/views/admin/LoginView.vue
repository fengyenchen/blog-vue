<script setup lang="ts">
</script>

<template>
  <div class="login-view max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mt-8">Admin Login</h1>
    <form class="w-full mt-8">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-primary/80 text-white py-2 rounded-md hover:bg-primary focus:outline-none transition cursor-pointer"
      >
        Login
      </button>
    </form>
  </div>
</template>