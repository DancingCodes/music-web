<template>
  <div v-if="player.current" class="sticky bottom-0 z-40 bg-neutral-950/95 border-t border-neutral-800">
    <div class="px-6 py-2.5">
      <div class="grid grid-cols-3 items-center">
        <div class="flex items-center gap-4">
          <img :src="player.current.pic_url" class="w-12 h-12 rounded-md object-cover shrink-0" />
          <div class="w-32 min-w-0 max-sm:hidden">
            <div class="text-sm truncate">{{ player.current.name }}</div>
            <div class="text-xs text-neutral-500 truncate mt-0.5">{{ player.current.artists }}</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-6">
          <SkipBack class="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer" @click="prev" />
          <div @click="toggle"
            class="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center cursor-pointer hover:scale-105">
            <Pause v-if="player.playing" class="w-4.5 h-4.5" />
            <Play v-else class="w-4.5 h-4.5 ml-0.5" />
          </div>
          <SkipForward class="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer" @click="next" />
          <div @click="togglePlayMode" class="cursor-pointer text-neutral-500 hover:text-neutral-300 shrink-0">
            <Repeat v-if="player.playMode === 'sequential'" class="w-3.5 h-3.5" />
            <Repeat1 v-else-if="player.playMode === 'single'" class="w-3.5 h-3.5" />
            <Shuffle v-else class="w-3.5 h-3.5" />
          </div>
        </div>

        <div />
      </div>
    </div>

    <div class="h-2 cursor-pointer bg-neutral-950/95"
      @click="seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
      <div class="h-full bg-red-500 rounded-r-full"
        :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
    </div>
  </div>
</template>

<script setup>
import { player, toggle, next, prev, seek, togglePlayMode } from '../stores/player.js'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from '@lucide/vue'
</script>
