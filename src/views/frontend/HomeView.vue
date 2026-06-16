<script setup lang="ts">
import Navbar from '../../components/Navbar.vue'
import SearchPosts from '../../components/SearchPosts.vue'
import Posts from '../../components/Posts.vue'
import BackToTop from '../../components/BackToTop.vue'
</script>

<template>
  <div class="home-view">
    <Navbar />
    <SearchPosts />
    <Posts />
    <BackToTop />
  </div>
</template>