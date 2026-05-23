<template>
  <div v-if="player.current" class="player-bar">
    <div class="player-glow" />
    <div class="player-inner">
      <div class="player-grid">
        <div class="player-left">
          <img :src="player.current.pic_url" class="player-cover" />
          <div class="player-info">
            <div class="player-song">{{ player.current.name }}</div>
            <div class="player-artist">{{ player.current.artists }}</div>
          </div>
        </div>

        <div class="player-center">
          <SkipBack class="player-skip-btn" @click="prev" />
          <div @click="toggle" class="player-play-btn" :class="{ 'player-play-btn--playing': player.playing }">
            <Pause v-if="player.playing" class="player-play-icon" />
            <Play v-else class="player-play-icon player-play-icon--offset" />
          </div>
          <SkipForward class="player-skip-btn" @click="next" />
          <div @click="togglePlayMode" class="player-mode-btn">
            <Repeat v-if="player.playMode === 'sequential'" class="player-mode-icon" />
            <Repeat1 v-else-if="player.playMode === 'single'" class="player-mode-icon" />
            <Shuffle v-else class="player-mode-icon" />
          </div>
          <ScrollText class="player-lyrics-btn" @click.stop="$emit('showLyrics')" />
        </div>

        <div class="player-right">
          <span>{{ formatTime(player.currentTime * 1000) }}</span>
          <span class="player-time-sep">/</span>
          <span>{{ formatTime(player.duration * 1000) }}</span>
        </div>
      </div>
    </div>

    <div class="player-progress" @click="seek(($event.offsetX / $event.currentTarget.offsetWidth) * player.duration)"
      @mousemove="onProgressHover" @mouseleave="showTimePreview = false">
      <div class="player-progress-fill" :style="{ width: (player.currentTime / player.duration * 100 || 0) + '%' }" />
      <div v-if="showTimePreview" class="player-time-preview" :style="{ left: hoverPercent + '%' }">
        {{ formatTime(previewTime * 1000) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { player, toggle, next, prev, seek, togglePlayMode } from '../stores/player.js'
import { formatTime } from '../utils/format.js'
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, ScrollText } from '@lucide/vue'

defineEmits(['showLyrics'])

const hoverPercent = ref(0)
const previewTime = ref(0)
const showTimePreview = ref(false)

function onProgressHover(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  hoverPercent.value = ((e.clientX - rect.left) / rect.width) * 100
  previewTime.value = (hoverPercent.value / 100) * player.duration
  showTimePreview.value = true
}
</script>

<style lang="scss" scoped>
.player-bar {
  position: relative;
  background: var(--c-bg);
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.06);

  .player-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse at 50% 100%, rgba(248, 113, 113, 0.06), transparent 60%);
  }

  .player-inner {
    position: relative;
    padding: 0.625rem 1.5rem;

    .player-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      align-items: center;

      .player-left {
        display: flex;
        align-items: center;
        gap: 1rem;

        .player-cover {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          object-fit: cover;
          animation: player-spin 30s linear infinite;
        }

        .player-info {
          width: 8rem;
          min-width: 0;

          @media (max-width: 640px) {
            display: none;
          }

          .player-song {
            font-size: 0.875rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .player-artist {
            font-size: 0.75rem;
            color: var(--c-text-sub);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 2px;
          }
        }
      }

      .player-center {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;

        .player-skip-btn {
          width: 1rem;
          height: 1rem;
          color: var(--c-text-sub);
          cursor: pointer;
          transition: color 0.2s;

          &:hover {
            color: var(--c-text);
          }
        }

        .player-play-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--c-text);
          color: var(--c-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            transform: scale(1.05);
          }

          &--playing {
            box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.3);
          }

          .player-play-icon {
            width: 1.125rem;
            height: 1.125rem;

            &--offset {
              margin-left: 2px;
            }
          }
        }

        .player-mode-btn {
          cursor: pointer;
          color: var(--c-text-sub);
          flex-shrink: 0;
          transition: color 0.2s;

          &:hover {
            color: var(--c-text);
          }

          .player-mode-icon {
            width: 0.875rem;
            height: 0.875rem;
          }
        }

        .player-lyrics-btn {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          color: var(--c-text-sub);
          flex-shrink: 0;
          transition: color 0.2s;

          &:hover {
            color: var(--c-text);
          }
        }
      }

      .player-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        font-size: 0.75rem;
        color: var(--c-text-sub);
        font-variant-numeric: tabular-nums;

        .player-time-sep {
          color: var(--c-text-sub);
        }
      }
    }
  }

  .player-progress {
    height: 0.5rem;
    cursor: pointer;
    background: var(--c-border);
    position: relative;

    .player-progress-fill {
      height: 100%;
      background: linear-gradient(to right, var(--c-red), var(--c-rose-400));
      border-radius: 0 9999px 9999px 0;
      transition: width 0.15s;
      box-shadow: 0 0 14px rgba(248, 113, 113, 0.6);
    }

    .player-time-preview {
      position: absolute;
      top: -2rem;
      transform: translateX(-50%);
      padding: 0.125rem 0.5rem;
      border-radius: 0.375rem;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      font-size: 0.75rem;
      pointer-events: none;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
}


@keyframes player-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
