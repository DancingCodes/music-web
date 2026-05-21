<script setup>
import { player, play } from '../stores/player.js'
import { formatTime } from '../utils/format.js'

const props = defineProps({
  music: Object,
  showSave: Boolean,
  saved: Boolean,
})

const emit = defineEmits(['save', 'delete'])
</script>

<template>
  <div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 group hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors">
    <img
      :src="music.pic_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23334155%22 width=%2240%22 height=%2240%22/><text fill=%22%2394a3b8%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2216%22>♪</text></svg>'"
      class="w-10 h-10 rounded object-cover shrink-0 bg-slate-200 dark:bg-slate-700"
      @error="$event.target.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23334155%22 width=%2240%22 height=%2240%22/><text fill=%22%2394a3b8%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2216%22>♪</text></svg>'"
    />
    <div class="flex-1 min-w-0 cursor-pointer" @click="play(music)">
      <div class="text-sm font-medium truncate" :class="{ 'text-emerald-500': player.current?.id === music.id }">{{ music.name }}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ music.artists }} · {{ formatTime(music.duration_ms) }}</div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button v-if="showSave && !saved" @click="$emit('save')" class="text-xs px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors">保存</button>
      <span v-if="showSave && saved" class="text-xs text-emerald-500 whitespace-nowrap">✓ 已收藏</span>
      <button
        @click="player.current?.id === music.id && player.playing ? player.howl?.pause() : play(music)"
        class="text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors"
        :class="{ 'text-emerald-500': player.current?.id === music.id && player.playing }"
      >
        <svg v-if="player.current?.id === music.id && player.playing" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><polygon points="8,5 19,12 8,19"/></svg>
      </button>
      <button v-if="$slots.actions" @click="$emit('delete')" class="text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/></svg>
      </button>
    </div>
  </div>
</template>
