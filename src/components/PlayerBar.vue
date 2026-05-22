<template>
  <div v-if="player.current" class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
    <div class="px-6 py-2.5">
      <div class="grid grid-cols-3 items-center">
        <div class="flex items-center gap-4">
          <img :src="player.current.pic_url" class="w-12 h-12 rounded-lg object-cover shrink-0" />
          <div class="w-32 min-w-0 max-sm:hidden">
            <div class="text-sm truncate">{{ player.current.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ player.current.artists }}</div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-6">
          <SkipBack class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200" @click="prev" />
          <div @click="toggle"
            class="w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
            <Pause v-if="player.playing" class="w-4.5 h-4.5" />
            <Play v-else class="w-4.5 h-4.5 ml-0.5" />
          </div>
          <SkipForward class="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200" @click="next" />
          <div @click="togglePlayMode" class="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 shrink-0 transition-colors duration-200">
            <Repeat v-if="player.playMode === 'sequential'" class="w-3.5 h-3.5" />
            <Repeat1 v-else-if="player.playMode === 'single'" class="w-3.5 h-3.5" />
            <Shuffle v-else class="w-3.5 h-3.5" />
          </div>
          <ScrollText class="w-4 h-4 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 shrink-0" @click.stop="$emit('showLyrics')" />
        </div>

        <div class="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
          <div class="flex items-center gap-2">
            <Volume2 v-if="player.volume >= 0.5" class="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 shrink-0" @click="toggleMute" />
            <Volume1 v-else-if="player.volume > 0" class="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 shrink-0" @click="toggleMute" />
            <VolumeX v-else class="w-4 h-4 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 shrink-0" @click="toggleMute" />
            <div ref="volTrack" class="w-16 py-1 cursor-pointer relative flex items-center" @click="seekVol" @mousedown="startDragVol">
              <div class="h-1 rounded-full bg-gray-300 dark:bg-gray-600 w-full">
                <div class="h-full rounded-full bg-red-500" :style="{ width: (player.volume * 100) + '%' }" />
              </div>
              <div class="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm top-1/2 -translate-y-1/2 -translate-x-1/2"
                :style="{ left: (player.volume * 100) + '%' }" />
            </div>
          </div>
          <span>{{ formatTime(player.currentTime * 1000) }}</span>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <span>{{ formatTime(player.duration * 1000) }}</span>
        </div>
      </div>
    </div>

    <div class="h-2 cursor-pointer bg-gray-200 dark:bg-gray-700"
      @click="seek(($event.offsetX / $event.currentTarget.offsetWidth) * player.duration)">
      <div class="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-r-full transition-all duration-150"
        :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { player, toggle, next, prev, seek, togglePlayMode, setVolume } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, ScrollText, Volume2, Volume1, VolumeX } from '@lucide/vue'

defineEmits(['showLyrics'])

const volTrack = ref(null)
const lastVolume = ref(player.volume)

function seekVol(e) {
  const rect = volTrack.value.getBoundingClientRect()
  setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)))
}

function startDragVol(e) {
  e.preventDefault()
  seekVol(e)
  const onMove = (ev) => {
    const rect = volTrack.value.getBoundingClientRect()
    setVolume(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)))
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function toggleMute() {
  if (player.volume > 0) {
    lastVolume.value = player.volume
    setVolume(0)
  } else {
    setVolume(lastVolume.value || 0.5)
  }
}
</script>
