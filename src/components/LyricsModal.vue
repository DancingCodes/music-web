<template>
  <Transition name="lyrics-modal">
    <div v-if="visible" class="lyrics-overlay" @click.self="close">
      <div class="lyrics-backdrop" />

      <div class="lyrics-content">
        <div class="lyrics-left">
          <img
            :src="picUrl || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'"
            class="lyrics-cover"
            :class="{ 'lyrics-cover--spinning': player.playing }"
            @error="$event.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'" />
          <div class="lyrics-meta">
            <h2 class="lyrics-song-name">{{ songName }}</h2>
            <p class="lyrics-artist">{{ artistName }}</p>
          </div>
        </div>

        <div class="lyrics-right">
          <div v-if="lines.length === 0" class="lyrics-empty">暂无歌词</div>

          <div v-else ref="scrollEl" class="lyrics-scroll" :class="$style.scrollContainer">
            <div
              v-for="(line, i) in lines"
              :key="i"
              :ref="el => { if (el) lineRefs[i] = el }"
              class="lyrics-line"
              :class="{
                'lyrics-line--active': i === activeIndex,
                'lyrics-line--lrc': isLrc && i !== activeIndex,
                'lyrics-line--plain': !isLrc && i !== activeIndex,
              }"
              @click="seekLine(line)"
            >{{ line.text }}</div>
          </div>
        </div>
      </div>

      <X class="lyrics-close" @click="close" />
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
.scrollContainer {
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
}

.scrollContainer::-webkit-scrollbar {
  display: none;
}
</style>

<style lang="scss" scoped>
.lyrics {
  &-overlay {
    position: fixed;
    z-index: 50;
    inset: 0;
    display: flex;
  }

  &-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &-content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  &-left {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 0 2rem;
  }

  &-cover {
    width: 18rem;
    height: 18rem;
    border-radius: 50%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    object-fit: cover;

    &--spinning {
      animation: cover-spin 30s linear infinite;
    }
  }

  &-meta {
    text-align: center;
  }

  &-song-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  &-artist {
    font-size: 1.125rem;
    color: var(--c-text-sub);
  }

  &-right {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 3rem;
  }

  &-empty {
    text-align: center;
    color: var(--c-text-sub);
    font-size: 1.125rem;
  }

  &-scroll {
    overflow-y: auto;
    height: 75vh;

    > * + * {
      margin-top: 0.25rem;
    }
  }

  &-line {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.5s ease;

    &--active {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(to right, var(--c-red-400), var(--c-rose-300));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &--lrc {
      color: var(--c-text-sub);
      font-size: 1.125rem;

      &:hover {
        color: var(--c-text-sub);
      }
    }

    &--plain {
      color: var(--c-text-sub);
      font-size: 1.125rem;
    }
  }

  &-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    z-index: 20;
    width: 1.5rem;
    height: 1.5rem;
    color: var(--c-text-sub);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
}

@keyframes cover-spin {
  to { transform: rotate(360deg); }
}

.lyrics-modal-enter-active,
.lyrics-modal-leave-active { transition: opacity 0.3s ease; }
.lyrics-modal-enter-from,
.lyrics-modal-leave-to { opacity: 0; }

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
