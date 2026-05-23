<template>
  <div class="song-row" :class="{ 'is-playing': isPlaying }" @click="$emit('play')">
    <span v-if="isPlaying" class="song-eq">
      <span class="song-eq-bar" style="animation-delay:0s" />
      <span class="song-eq-bar" style="animation-delay:0.2s" />
      <span class="song-eq-bar" style="animation-delay:0.1s" />
    </span>
    <span v-else class="song-index">{{ index }}</span>
    <img
      :src="music.pic_url || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'"
      class="song-cover"
      @error="$event.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23262626%22 width=%2240%22 height=%2240%22/><text fill=%22%23737373%22 x=%2220%22 y=%2226%22 text-anchor=%22middle%22 font-size=%2214%22>♪</text></svg>'" />
    <div class="song-info">
      <div class="song-name" :class="{ 'text-red': isPlaying }">{{ music.name }}</div>
      <div class="song-artists">{{ music.artists }} · {{ formatTime(music.duration_ms) }}</div>
    </div>
    <div @click.stop="$emit('delete')" class="song-delete">
      <Trash2 class="song-icon" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTime } from '../utils/format.js'
import { player } from '../stores/player.js'
import { Trash2 } from '@lucide/vue'

const props = defineProps({ music: Object, index: Number })
defineEmits(['play', 'delete'])

const isPlaying = computed(() => player.current?.id === props.music.id && player.playing)
</script>

<style lang="scss" scoped>
.song-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--c-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(239, 68, 68, 0.05);

    .song-delete {
      opacity: 1;
    }
  }

  &.is-playing {
    background: var(--c-active);

    &:hover {
      background: var(--c-active);
    }
  }
}

.song-eq {
  width: 1.5rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.song-eq-bar {
  width: 2px;
  background: var(--c-red-400);
  border-radius: 9999px;
  animation: equalizer 0.6s ease-in-out infinite;
}

.song-index {
  width: 1.5rem;
  font-size: 0.75rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  color: var(--c-text-sub);
}

.song-cover {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.text-red {
    color: var(--c-red);
  }
}

.song-artists {
  font-size: 0.75rem;
  color: var(--c-text-sub);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}

.song-delete {
  cursor: pointer;
  color: var(--c-text-sub);
  opacity: 0;
  flex-shrink: 0;
  transition: color 0.2s, opacity 0.2s;

  &:hover {
    color: var(--c-red);
  }
}

.song-icon {
  width: 1rem;
  height: 1rem;
}

@keyframes equalizer {
  0%, 100% { height: 3px; }
  50% { height: 12px; }
}
</style>
