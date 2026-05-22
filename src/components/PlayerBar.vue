<template>
  <div v-if="player.current" class="bg-white/80 backdrop-blur-lg shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
    <div class="px-6 py-2.5">
      <div class="grid grid-cols-3 items-center">
        <div class="flex items-center gap-4">
          <img :src="player.current.pic_url" class="w-12 h-12 rounded-lg object-cover shrink-0" />
          <div class="w-32 min-w-0 max-sm:hidden">
            <div class="text-sm truncate">{{ player.current.name }}</div>
            <div class="text-xs text-gray-500 truncate mt-0.5">{{ player.current.artists }}</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-6">
          <SkipBack class="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors duration-200" @click="prev" />
          <div @click="toggle"
            class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
            <Pause v-if="player.playing" class="w-4.5 h-4.5" />
            <Play v-else class="w-4.5 h-4.5 ml-0.5" />
          </div>
          <SkipForward class="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors duration-200" @click="next" />
          <div @click="togglePlayMode" class="cursor-pointer text-gray-500 hover:text-gray-900 shrink-0 transition-colors duration-200">
            <Repeat v-if="player.playMode === 'sequential'" class="w-3.5 h-3.5" />
            <Repeat1 v-else-if="player.playMode === 'single'" class="w-3.5 h-3.5" />
            <Shuffle v-else class="w-3.5 h-3.5" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 text-xs text-gray-500 tabular-nums">
          <span>{{ formatTime(player.currentTime * 1000) }}</span>
          <span class="text-gray-300">/</span>
          <span>{{ formatTime(player.duration * 1000) }}</span>
        </div>
      </div>
    </div>

    <div class="h-2 cursor-pointer bg-gray-200"
      @click="seek(($event.offsetX / $event.currentTarget.offsetWidth) * player.duration)">
      <div class="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-r-full transition-all duration-150"
        :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
    </div>
  </div>
</template>

<script setup>
import { player, toggle, next, prev, seek, togglePlayMode } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from '@lucide/vue'
</script>
