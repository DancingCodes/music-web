<script setup>
import { ref, watch, nextTick } from 'vue'
import { player, seek } from '../stores/player.js'

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

const lyrics = ref([])
const currentIdx = ref(-1)
let animFrame

watch(() => player.current?.lyric, (lyric) => {
  lyrics.value = parseLyric(lyric)
})

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
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="close">
      <div
        class="absolute inset-0 bg-cover bg-center blur-xl opacity-60"
        :style="{ backgroundImage: `url(${player.current?.pic_url})` }"
      />
      <div class="absolute inset-0 bg-black/70" />
      <div class="relative z-10 w-full max-w-lg mx-auto px-6 flex flex-col items-center h-full max-h-full overflow-hidden py-10">
        <button @click="close" class="self-end text-white/50 hover:text-white cursor-pointer mb-4">
          <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <img v-if="player.current?.pic_url" :src="player.current.pic_url" class="w-48 h-48 rounded-xl shadow-2xl object-cover mb-6" />
        <h2 class="text-white text-lg font-bold mb-1">{{ player.current?.name }}</h2>
        <p class="text-white/60 text-sm mb-8">{{ player.current?.artists }}</p>
        <div ref="lyricEl" class="flex-1 w-full overflow-y-auto text-center space-y-4 scrollbar-hide mb-6">
          <p
            v-for="(l, i) in lyrics"
            :key="i"
            class="text-sm cursor-pointer transition-all"
            :class="i === currentIdx ? 'text-emerald-400 text-lg font-bold' : 'text-white/40'"
            @click="seek(l.time / 1000)"
          >{{ l.text }}</p>
        </div>
        <div class="w-full max-w-md">
          <div class="relative h-1 bg-white/20 rounded-full mb-4 cursor-pointer" @click="seek(($event.offsetX / $event.target.offsetWidth) * player.duration)">
            <div class="absolute left-0 top-0 h-full bg-emerald-500 rounded-full" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
          </div>
          <div class="flex items-center justify-center gap-6">
            <button @click="player.howl?.pause(); close()" class="text-white/60 hover:text-white cursor-pointer">
              <svg viewBox="0 0 24 24" class="w-8 h-8" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
