<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

const checkScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
    <button 
        v-show="isVisible" 
        class="back-to-top w-10 h-10 fixed bottom-4 right-4 rounded-full bg-primary text-white transition opacity-75 hover:opacity-100 cursor-pointer" 
        @click="scrollToTop"
        aria-label="回到頂部"
    >
        ▲
    </button>
</template>