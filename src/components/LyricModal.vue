<script setup>
import { ref, watch, computed } from 'vue'
import { player, seek } from '../stores/player.js'
import { IconClose, IconPlay, IconPause, IconPrev, IconNext } from '../utils/icons.js'

const show = ref(false)
const lyricEl = ref(null)

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') show.value = false
})

function open() { show.value = true }
function close() { show.value = false }

defineExpose({ open, close })

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
    <div v-if="show" class="fixed inset-0 z-50 flex flex-col" @click.self="close">
      <div
        class="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
        :style="{ backgroundImage: `url(${player.current?.pic_url})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      <button @click="close" class="absolute top-6 right-6 z-20 text-white/40 hover:text-white cursor-pointer">
        <IconClose class="w-7 h-7" />
      </button>

      <div class="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pt-12 pb-8 overflow-hidden">
        <div class="relative mb-10">
          <div class="w-64 h-64 rounded-full border-4 border-white/10 p-1.5">
            <img
              v-if="player.current?.pic_url"
              :src="player.current.pic_url"
              class="w-full h-full rounded-full object-cover shadow-2xl"
              :class="{ 'animate-spin': player.playing }"
              style="animation-duration: 20s"
            />
          </div>
        </div>

        <h2 class="text-white text-2xl font-bold mb-2 text-center truncate max-w-full">{{ player.current?.name }}</h2>
        <p class="text-white/50 text-sm mb-10">{{ player.current?.artists }}</p>

        <div ref="lyricEl" class="flex-1 w-full max-w-md mx-auto overflow-y-auto scrollbar-hide text-center space-y-5 mb-8" style="scrollbar-width:none;-ms-overflow-style:none">
          <p v-if="lyrics.length === 0" class="text-white/20 text-sm mt-10">暂无歌词</p>
          <p
            v-for="(l, i) in lyrics"
            :key="i"
            class="cursor-pointer transition-all duration-300"
            :class="i === currentIdx ? 'text-white text-2xl font-bold' : 'text-white/30 text-base'"
            @click="seek(l.time / 1000)"
          >{{ l.text }}</p>
        </div>

        <div class="w-full max-w-md">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs text-white/30 w-10 text-right">{{ Math.floor(player.currentTime / 60) }}:{{ String(Math.floor(player.currentTime % 60)).padStart(2, '0') }}</span>
            <div class="relative flex-1 h-1 bg-white/10 rounded-full cursor-pointer" @click="seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
              <div class="absolute left-0 top-0 h-full bg-white/60 rounded-full" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
            </div>
            <span class="text-xs text-white/30 w-10">{{ Math.floor(player.duration / 60) }}:{{ String(Math.floor(player.duration % 60)).padStart(2, '0') }}</span>
          </div>
          <div class="flex items-center justify-center gap-8">
            <IconPrev class="w-6 h-6 text-white/40 hover:text-white cursor-pointer" />
            <button class="text-white cursor-pointer">
              <IconPause v-if="player.playing" class="w-10 h-10" />
              <IconPlay v-else class="w-10 h-10" />
            </button>
            <IconNext class="w-6 h-6 text-white/40 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
