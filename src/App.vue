<template>
  <div class="fixed inset-0 flex flex-col bg-neutral-900 text-white box-border">
    <LibraryPage class="flex-1 min-h-0 w-full px-6 pt-10 box-border" />
    <PlayerBar />
  </div>
  <ToastContainer />
</template>

<script setup>
import LibraryPage from './views/LibraryPage.vue'
import PlayerBar from './components/PlayerBar.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>
