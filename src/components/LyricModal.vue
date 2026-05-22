<script setup>
import { ref, watch, computed } from 'vue'
import { player, seek, toggle, next, prev, setVolume, togglePlayMode } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import { IconClose, IconPlay, IconPause, IconPrev, IconNext, IconLoop, IconSingle, IconShuffle, IconSpeaker } from '../utils/icons.js'

const VINYL_BG = 'https://filestore.moonc.love/uploadFiles/1752216410894-161065103.png'
const TONEARM = 'https://filestore.moonc.love/uploadFiles/1752216426296-916133906.png'

const show = ref(false)
const lyricEl = ref(null)

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') close()
})

watch(() => player.current, (v) => {
  if (v) show.value = true
})

function close() {
  show.value = false
  if (player.playing) toggle()
}

function parseLyric(lyric) {
  if (!lyric) return []
  const lines = []
  const re = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g
  let m
  while ((m = re.exec(lyric))) {
    const min = parseInt(m[1])
    const sec = parseInt(m[2])
    const ms = parseInt(m[3].padEnd(3, '0'))
    lines.push({ time: (min * 60 + sec) * 1000 + ms, text: m[4].trim() || '...' })
  }
  return lines
}

const lyrics = computed(() => parseLyric(player.current?.lyric))
const currentIdx = ref(-1)
let animFrame

function onTick() {
  if (!show.value) {
    cancelAnimationFrame(animFrame)
    return
  }
  const t = player.currentTime * 1000
  const idx = lyrics.value.findIndex((l, i) => {
    const next = lyrics.value[i + 1]
    return l.time <= t && (!next || next.time > t)
  })
  if (idx !== currentIdx.value) {
    currentIdx.value = idx
    if (lyricEl.value) {
      const el = lyricEl.value.children[idx]
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  animFrame = requestAnimationFrame(onTick)
}

watch(show, (v) => {
  if (v) animFrame = requestAnimationFrame(onTick)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50" @click.self="close">
      <div
        class="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
        :style="{ backgroundImage: `url(${player.current?.pic_url})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      <button @click="close" class="absolute top-6 right-6 z-20 text-white/40 hover:text-white cursor-pointer">
        <IconClose class="w-7 h-7" />
      </button>

      <div class="relative z-10 h-full flex flex-col px-6 pt-16 pb-6">
        <div class="flex-1 flex gap-8 max-sm:flex-col max-sm:gap-4 max-sm:overflow-y-auto">
          <div class="flex-1 flex flex-col items-center justify-center max-sm:flex-none">
            <div class="relative w-52 h-52 max-sm:w-40 max-sm:h-40">
              <div
                class="w-full h-full bg-cover animate-spin rounded-full"
                :style="{
                  backgroundImage: `url(${VINYL_BG})`,
                  animationDuration: '20s',
                  animationPlayState: player.playing ? 'running' : 'paused',
                }"
              >
                <img
                  v-if="player.current?.pic_url"
                  :src="player.current.pic_url"
                  class="w-[38%] h-[38%] rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <img
                :src="TONEARM"
                class="absolute top-0 right-0 h-[70%] transition-transform duration-500"
                style="transform-origin: top right"
                :style="{ transform: player.playing ? 'translate(76%,-20%)' : 'translate(76%,-20%) rotate(-16deg)' }"
              />
            </div>

            <h2 class="text-white text-xl font-bold mt-6 mb-1 text-center truncate max-w-[280px]">{{ player.current?.name }}</h2>
            <p class="text-white/50 text-sm">{{ player.current?.artists }}</p>
          </div>

          <div
            ref="lyricEl"
            class="flex-1 h-full overflow-y-auto scrollbar-hide text-center space-y-5 max-sm:w-full max-sm:flex-none max-sm:h-auto max-sm:max-h-[30vh]"
            style="scrollbar-width:none;-ms-overflow-style:none"
          >
            <p v-if="lyrics.length === 0" class="text-white/20 text-sm mt-10">暂无歌词</p>
            <p
              v-for="(l, i) in lyrics"
              :key="i"
              class="cursor-pointer transition-all duration-300"
              :class="i === currentIdx ? 'text-white text-2xl font-bold' : 'text-white/30 text-base'"
              @click="seek(l.time / 1000)"
            >{{ l.text }}</p>
          </div>
        </div>

        <div class="w-full max-w-2xl mx-auto mt-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-xs text-white/30 w-10 text-right">{{ formatTime(player.currentTime * 1000) }}</span>
            <div class="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer" @click="seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
              <div class="absolute left-0 top-0 h-full bg-white/20 rounded-full" :style="{ width: (player.buffered * 100 || 0) + '%' }" />
              <div class="absolute left-0 top-0 h-full bg-white/60 rounded-full" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
            </div>
            <span class="text-xs text-white/30 w-10">{{ formatTime(player.duration * 1000) }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 w-28">
              <IconSpeaker class="w-4 h-4 text-white/30 shrink-0" />
              <input type="range" min="0" max="1" step="0.01" :value="player.volume" @input="setVolume(parseFloat($event.target.value))" class="w-full h-1 accent-white/60" />
            </div>

            <div class="flex items-center gap-8">
              <IconPrev class="w-6 h-6 text-white/40 hover:text-white cursor-pointer" @click="prev" />
              <button class="text-white cursor-pointer" @click="toggle">
                <IconPause v-if="player.playing" class="w-10 h-10" />
                <IconPlay v-else class="w-10 h-10" />
              </button>
              <IconNext class="w-6 h-6 text-white/40 hover:text-white cursor-pointer" @click="next" />
            </div>

            <button @click="togglePlayMode" class="cursor-pointer w-28 text-right text-white/40 hover:text-white/80 transition-colors">
              <IconLoop v-if="player.playMode === 'sequential'" class="w-5 h-5 ml-auto" />
              <IconSingle v-else-if="player.playMode === 'single'" class="w-5 h-5 ml-auto" />
              <IconShuffle v-else class="w-5 h-5 ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
