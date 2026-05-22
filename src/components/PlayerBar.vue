<script setup>
import { ref } from 'vue'
import { player, toggle, next, prev, setVolume, toggleLoop } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import { BackwardIcon, ForwardIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/solid'
import LyricModal from './LyricModal.vue'

const lyricModal = ref(null)
</script>

<template>
  <div v-if="player.current" class="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
    <div class="flex items-center max-w-4xl mx-auto px-4 h-16 gap-4">
      <img :src="player.current.pic_url" class="w-10 h-10 rounded object-cover shrink-0 bg-zinc-200 dark:bg-zinc-700 cursor-pointer" @click="lyricModal?.open()" />
      <div class="min-w-0 w-40">
        <div class="text-sm font-medium truncate">{{ player.current.name }}</div>
        <div class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ player.current.artists }}</div>
      </div>
      <div class="flex items-center gap-3">
        <button @click="prev" class="text-zinc-500 hover:text-white cursor-pointer transition-colors">
          <BackwardIcon class="w-5 h-5" />
        </button>
        <button @click="toggle" class="text-zinc-200 cursor-pointer">
          <PauseIcon v-if="player.playing" class="w-8 h-8" />
          <PlayIcon v-else class="w-8 h-8" />
        </button>
        <button @click="next" class="text-zinc-500 hover:text-white cursor-pointer transition-colors">
          <ForwardIcon class="w-5 h-5" />
        </button>
      </div>
      <div class="flex-1 flex items-center gap-2">
        <span class="text-xs text-zinc-500 w-10 text-right">{{ formatTime(player.currentTime * 1000) }}</span>
        <div class="relative flex-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full cursor-pointer" @click="player.howl?.seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
          <div class="absolute left-0 top-0 h-full bg-emerald-500 rounded-full" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
        </div>
        <span class="text-xs text-zinc-500 w-10">{{ formatTime(player.duration * 1000) }}</span>
      </div>
      <button @click="toggleLoop" class="cursor-pointer" :class="player.loop ? 'text-emerald-500' : 'text-zinc-400 hover:text-white'">
        <ArrowPathRoundedSquareIcon class="w-5 h-5" />
      </button>
      <div class="flex items-center gap-2 w-32">
        <SpeakerWaveIcon class="w-4 h-4 text-zinc-400" />
        <input type="range" min="0" max="1" step="0.01" :value="player.volume" @input="setVolume(parseFloat($event.target.value))" class="w-full h-1 accent-emerald-500" />
      </div>
    </div>
    <LyricModal ref="lyricModal" />
  </div>
</template>
