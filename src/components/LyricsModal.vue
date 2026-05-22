<template>
  <Transition name="lyrics-modal">
    <div v-if="visible" class="fixed z-50 inset-0 flex" @click.self="close">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div class="relative z-10 w-full h-full flex items-center">
        <div class="w-[40%] flex flex-col items-center justify-center gap-6 px-8 lyrics-left">
          <img
            :src="picUrl || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'"
            class="w-72 h-72 rounded-2xl shadow-2xl object-cover"
            @error="$event.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'" />
          <div class="text-center">
            <h2 class="text-2xl font-bold text-white mb-2">{{ songName }}</h2>
            <p class="text-lg text-gray-300">{{ artistName }}</p>
          </div>
        </div>

        <div class="w-[60%] flex flex-col justify-center pr-12 lyrics-right">
          <div
            v-if="lines.length === 0"
            class="text-center text-gray-400 dark:text-gray-500 text-lg"
          >暂无歌词</div>

          <div
            v-else
            ref="scrollContainer"
            class="overflow-y-auto h-[75vh] space-y-1"
            style="scrollbar-width:none;-ms-overflow-style:none"
            :class="$style.scrollContainer"
          >
            <div
              v-for="(line, i) in lines"
              :key="i"
              :ref="el => { if (el) lineRefs[i] = el }"
              class="py-2 px-4 rounded-xl cursor-pointer transition-all duration-500"
              :class="i === activeIndex
                ? 'text-red-400 text-2xl font-bold'
                : isLrc
                  ? 'text-gray-400 dark:text-gray-500 text-lg hover:text-gray-200'
                  : 'text-gray-300 text-lg'"
              @click="seekLine(line)"
            >{{ line.text }}</div>
          </div>
        </div>
      </div>

      <X
        class="absolute top-6 right-6 z-20 w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors duration-200"
        @click="close"
      />
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { X } from '@lucide/vue'
import { player, seek } from '../stores/player.js'
import { parseLyrics } from '../utils/lyrics.js'

const visible = ref(false)
const lineRefs = ref({})
const scrollContainer = ref(null)

const songName = computed(() => player.current?.name || '')
const artistName = computed(() => player.current?.artists || '')
const picUrl = computed(() => player.current?.pic_url || '')

const lines = computed(() => {
  const raw = player.current?.lyric
  return parseLyrics(raw)
})

const isLrc = computed(() => {
  const times = lines.value.map(l => l.time)
  return new Set(times).size > 1
})

const activeIndex = computed(() => {
  if (!lines.value.length || !isLrc.value) return -1
  const t = player.currentTime
  let idx = -1
  const len = lines.value.length
  for (let i = 0; i < len; i++) {
    if (lines.value[i].time <= t) {
      idx = i
    } else {
      break
    }
  }
  return idx
})

function scrollToCurrent() {
  const idx = activeIndex.value
  if (idx < 0) return
  nextTick(() => {
    const el = lineRefs.value[idx]
    el?.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
}

watch(visible, (val) => {
  if (val) {
    setTimeout(scrollToCurrent, 350)
  }
})

watch(activeIndex, (newIdx) => {
  if (newIdx < 0) return
  nextTick(() => {
    const el = lineRefs.value[newIdx]
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
})

watch(() => player.current, () => {
  lineRefs.value = {}
})

function seekLine(line) {
  if (isLrc.value && line.time >= 0) {
    seek(line.time)
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

function open() {
  visible.value = true
  document.addEventListener('keydown', onKeydown)
}

function close() {
  visible.value = false
  document.removeEventListener('keydown', onKeydown)
}

defineExpose({ open, close })
</script>

<style module>
.scrollContainer::-webkit-scrollbar {
  display: none;
}
</style>

<style scoped>
.lyrics-modal-enter-active,
.lyrics-modal-leave-active {
  transition: opacity 0.3s ease;
}
.lyrics-modal-enter-from,
.lyrics-modal-leave-to {
  opacity: 0;
}

.lyrics-left {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.lyrics-right {
  transition: transform 0.4s ease 0.05s, opacity 0.4s ease 0.05s;
}

.lyrics-modal-enter-from .lyrics-left {
  transform: translateX(-30px);
  opacity: 0;
}
.lyrics-modal-enter-from .lyrics-right {
  transform: translateX(30px);
  opacity: 0;
}
.lyrics-modal-leave-to .lyrics-left {
  transform: translateX(-30px);
  opacity: 0;
}
.lyrics-modal-leave-to .lyrics-right {
  transform: translateX(30px);
  opacity: 0;
}
</style>
