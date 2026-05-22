<template>
  <div class="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 box-border transition-colors duration-300">
    <LibraryPage />
    <PlayerBar @showLyrics="lyricsModal?.open()" />
  </div>
  <ToastContainer />
  <LyricsModal ref="lyricsModal" />
</template>

<script setup>
import { ref } from 'vue'
import LibraryPage from './views/LibraryPage.vue'
import PlayerBar from './components/PlayerBar.vue'
import ToastContainer from './components/ToastContainer.vue'
import LyricsModal from './components/LyricsModal.vue'

const lyricsModal = ref(null)
</script>
