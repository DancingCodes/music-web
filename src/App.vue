<template>
  <div class="fixed inset-0 flex flex-col bg-white text-gray-900 box-border">
    <LibraryPage />
    <PlayerBar />
  </div>
  <ToastContainer />
</template>

<script setup>
import LibraryPage from './views/LibraryPage.vue'
import PlayerBar from './components/PlayerBar.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>
