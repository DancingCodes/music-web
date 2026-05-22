<template>
  <div
    class="flex items-center gap-4 px-3 py-2.5 rounded-lg cursor-pointer group"
    :class="isPlaying ? 'bg-red/5' : 'hover:bg-neutral-900'"
    @click="$emit('play')"
  >
    <span class="w-6 text-xs text-right tabular-nums shrink-0" :class="isPlaying ? 'text-red' : 'text-neutral-600'">{{ index }}</span>
    <img
      :src="music.pic_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'"
      class="w-10 h-10 rounded-md object-cover shrink-0"
      @error="$event.target.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'"
    />
    <div class="flex-1 min-w-0">
      <div class="text-sm truncate" :class="{ 'text-red': isPlaying }">{{ music.name }}</div>
      <div class="text-xs text-neutral truncate mt-0.5">{{ music.artists }} · {{ formatTime(music.duration_ms) }}</div>
    </div>
    <div
      @click.stop="$emit('delete')"
      class="cursor-pointer text-neutral-600 hover:text-red opacity-0 group-hover:opacity-100 shrink-0"
    >
      <Trash2 class="w-4 h-4" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '../utils/format.js'
import { player } from '../stores/player.js'
import { Trash2 } from '@lucide/vue'

const props = defineProps({ music: Object, index: Number })
defineEmits(['play', 'delete'])

const isPlaying = computed(() => player.current?.id === props.music.id && player.playing)
</script>
