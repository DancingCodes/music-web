<template>
  <div class="flex flex-col items-center justify-center py-20 text-zinc-400">
    <MusicalNoteIcon class="w-16 h-16 mb-4" />
    <p class="text-sm mb-4">还没有收藏歌曲</p>
    <router-link to="/search" class="text-sm px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">去搜索吧</router-link>
  </div>
</template>

<script setup>
import { MusicalNoteIcon } from '@heroicons/vue/24/outline'
</script>
