<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const back = () => router.back()
</script>

<template>
    <section class="back-button mb-4">
        <button @click="back" class="text-primary cursor-pointer">←</button>
    </section>
</template>