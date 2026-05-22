<script setup>
import { computed } from 'vue'
import { formatTime } from '../utils/format.js'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  music: Object,
  saved: Boolean,
  saving: Boolean,
})

const emit = defineEmits(['save'])

const artistNames = computed(() => {
  const a = props.music.artists
  if (Array.isArray(a)) return a.map(x => x.name).join(',')
  return a || ''
})
</script>

<template>
  <div class="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 group hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg px-2 -mx-2 transition-colors">
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium truncate">{{ music.name }}</div>
      <div class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ artistNames }} · {{ formatTime(music.duration) }}</div>
    </div>
    <div class="flex items-center gap-2 shrink-0">
      <button v-if="!saved" :disabled="saving" @click="$emit('save')" class="text-xs px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors disabled:opacity-50">
        <ArrowPathIcon v-if="saving" class="w-3.5 h-3.5 animate-spin" />
        <span v-else>保存</span>
      </button>
    </div>
  </div>
</template>
