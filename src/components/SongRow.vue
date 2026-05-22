<script setup>
import { computed } from 'vue'
import { formatTime } from '../utils/format.js'
import { player } from '../stores/player.js'
import { IconTrash, IconSpeaker } from '../utils/icons.js'

const props = defineProps({
  music: Object,
  saved: Boolean,
  saving: Boolean,
})

const emit = defineEmits(['play', 'save', 'delete'])

const isPlaying = computed(() => player.current?.id === props.music.id && player.playing)
</script>

<template>
  <div class="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg px-2 -mx-2 transition-colors" :class="{ 'bg-emerald-500/10 border-emerald-500/30': isPlaying }">
    <img
      :src="music.pic_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23334155%22 width=%2240%22 height=%2240%22/><text fill=%22%2394a3b8%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2216%22>♪</text></svg>'"
      class="w-10 h-10 rounded object-cover shrink-0 bg-zinc-200 dark:bg-zinc-700"
      @error="$event.target.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23334155%22 width=%2240%22 height=%2240%22/><text fill=%22%2394a3b8%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2216%22>♪</text></svg>'"
    />
    <div class="flex-1 min-w-0 cursor-pointer" @click="$emit('play')">
      <div class="flex items-center gap-1.5">
        <IconSpeaker v-if="isPlaying" class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span class="text-sm font-medium truncate" :class="{ 'text-emerald-500': isPlaying }">{{ music.name }}</span>
      </div>
      <div class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ music.artists }} · {{ formatTime(music.duration_ms) }}</div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button v-if="$slots.actions" @click="$emit('delete')" class="text-zinc-400 hover:text-red-500 cursor-pointer transition-colors">
        <IconTrash class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
