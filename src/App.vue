<template>
  <div class="app-shell">
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

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="scss" scoped>
.app-shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  color: var(--c-text);
  box-sizing: border-box;
  transition: background 0.3s, color 0.3s;
  background-image: var(--c-dot);
  background-size: 28px 28px;
}
</style>
