<script setup>
import { ref } from 'vue'
import { player, toggle, next, prev, setVolume } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import LyricModal from './LyricModal.vue'

const lyricModal = ref(null)
</script>

<template>
  <div v-if="player.current" class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
    <!-- desktop -->
    <div class="hidden md:flex items-center max-w-4xl mx-auto px-4 h-16 gap-4">
      <img :src="player.current.pic_url" class="w-10 h-10 rounded object-cover shrink-0 bg-slate-200 dark:bg-slate-700 cursor-pointer" @click="lyricModal?.open()" />
      <div class="min-w-0 w-40">
        <div class="text-sm font-medium truncate">{{ player.current.name }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ player.current.artists }}</div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="prev" class="text-slate-500 hover:text-white cursor-pointer transition-colors">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><polygon points="19,20 9,12 19,4"/><rect x="5" y="4" width="2" height="16"/></svg>
        </button>
        <button @click="toggle" class="text-slate-200 cursor-pointer">
          <svg v-if="player.playing" viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          <svg v-else viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>
        </button>
        <button @click="next" class="text-slate-500 hover:text-white cursor-pointer transition-colors">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><polygon points="5,4 15,12 5,20"/><rect x="17" y="4" width="2" height="16"/></svg>
        </button>
      </div>
      <div class="flex-1 flex items-center gap-2">
        <span class="text-xs text-slate-500 w-10 text-right">{{ formatTime(player.currentTime * 1000) }}</span>
        <div class="relative flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer" @click="player.howl?.seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
          <div class="absolute left-0 top-0 h-full bg-emerald-500 rounded-full" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
        </div>
        <span class="text-xs text-slate-500 w-10">{{ formatTime(player.duration * 1000) }}</span>
      </div>
      <button @click="lyricModal?.open()" class="text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      </button>
      <div class="flex items-center gap-2 w-32">
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400" fill="currentColor"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        <input type="range" min="0" max="1" step="0.01" :value="player.volume" @input="setVolume(parseFloat($event.target.value))" class="w-full h-1 accent-emerald-500" />
      </div>
    </div>
    <!-- mobile -->
    <div class="flex md:hidden items-center px-3 h-14 gap-3">
      <img :src="player.current.pic_url" class="w-8 h-8 rounded object-cover shrink-0 bg-slate-200 dark:bg-slate-700 cursor-pointer" @click="lyricModal?.open()" />
      <div class="min-w-0 flex-1" @click="lyricModal?.open()">
        <div class="text-sm font-medium truncate">{{ player.current.name }}</div>
        <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ player.current.artists }}</div>
      </div>
      <button @click="toggle" class="text-slate-200 cursor-pointer">
        <svg v-if="player.playing" viewBox="0 0 24 24" class="w-7 h-7" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <svg v-else viewBox="0 0 24 24" class="w-7 h-7" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>
      </button>
      <button @click="next" class="text-slate-400 cursor-pointer">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><polygon points="5,4 15,12 5,20"/><rect x="17" y="4" width="2" height="16"/></svg>
      </button>
    </div>
    <LyricModal ref="lyricModal" />
  </div>
</template>
