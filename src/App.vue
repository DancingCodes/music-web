<script setup>
import Navbar from './components/Navbar.vue'
import LibraryPage from './views/LibraryPage.vue'
import LyricModal from './components/LyricModal.vue'
import ToastContainer from './components/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
    <Navbar />
    <main class="flex-1 max-w-4xl mx-auto w-full px-4 pb-8">
      <LibraryPage />
    </main>
    <LyricModal />
    <ToastContainer />
  </div>
</template>
