<script setup>
import { ref, onMounted } from 'vue'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

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
  <header class="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
    <div class="max-w-4xl mx-auto flex items-center justify-between px-4 h-14">
      <router-link to="/" class="text-xl font-bold tracking-tight">Music</router-link>
      <nav class="flex items-center gap-4">
        <router-link to="/" class="text-sm hover:text-emerald-500 transition-colors" active-class="text-emerald-500">曲库</router-link>
        <router-link to="/search" class="text-sm hover:text-emerald-500 transition-colors" active-class="text-emerald-500">搜索</router-link>
        <button @click="toggleTheme" class="cursor-pointer">
          <SunIcon v-if="dark" class="w-5 h-5" />
          <MoonIcon v-else class="w-5 h-5" />
        </button>
      </nav>
    </div>
  </header>
</template>
