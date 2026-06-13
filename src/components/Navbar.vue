<script setup lang="ts">
</script>

<template>
  <nav class="navbar sticky top-0 left-0 right-0 z-50 flex items-center justify-between bg-bg border-b border-primary text-primary">
    <a href="/"><div class="logo px-8 py-4 border-r border-primary font-bold">BLOG-VUE</div></a>
    <ul class="nav-links flex items-center">
      <a href="https://github.com/fengyenchen" target="_blank" class="px-8 py-4 border-l border-primary">Github</a>
      <RouterLink to="/login" class="bg-primary text-white px-8 py-4 border-l border-primary">Login</RouterLink>
    </ul>
  </nav>
</template>