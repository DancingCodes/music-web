<script setup>
import Navbar from './components/Navbar.vue'
import PlayerBar from './components/PlayerBar.vue'
import ToastContainer from './components/ToastContainer.vue'
import LyricModal from './components/LyricModal.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
    <Navbar />
    <main class="flex-1 max-w-4xl mx-auto w-full px-4 pb-24">
      <router-view />
    </main>
    <PlayerBar />
    <ToastContainer />
    <LyricModal />
  </div>
</template>
