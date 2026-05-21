<script setup>
import { ref, onMounted } from 'vue'

const saved = localStorage.getItem('theme')
const isDark = saved === null ? true : saved === 'dark'
const dark = ref(isDark)
if (isDark) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.setItem('theme', dark.value ? 'dark' : 'light')
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-4xl mx-auto flex items-center justify-between px-4 h-14">
      <router-link to="/" class="text-xl font-bold tracking-tight">♪ Music</router-link>
      <nav class="flex items-center gap-4">
        <router-link to="/" class="text-sm hover:text-emerald-500 transition-colors" active-class="text-emerald-500">搜索</router-link>
        <router-link to="/library" class="text-sm hover:text-emerald-500 transition-colors" active-class="text-emerald-500">曲库</router-link>
        <button @click="toggleTheme" class="text-lg cursor-pointer">
          <svg v-if="dark" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </nav>
    </div>
  </header>
</template>
