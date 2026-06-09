<script setup lang="ts">
</script>

<template>
  <section class="search flex items-center justify-between border-b border-[var(--color-primary)]">
    <div class="search-input pl-8 pr-8 py-4 flex-1">
      <input
        class="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        type="search"
        placeholder="搜尋文章..."
      />
    </div>
    <div class="search-button pr-8 py-4">
      <button
        class="rounded-md border border-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
        type="button"
      >
        搜尋
      </button>
    </div>
  </section>
</template>