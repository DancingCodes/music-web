<template>
  <Transition name="search-modal">
    <div v-if="show" class="search-overlay" @click.self="close">
      <div class="search-backdrop" />
      <div class="search-panel">
        <div class="search-close-row">
          <X @click="close" class="search-close-btn" />
        </div>

        <div class="search-input-wrap">
          <Search class="search-input-icon" />
          <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云曲库" class="search-input" />
        </div>

        <div v-if="results.length" class="search-count">{{ total }} 首结果</div>

        <div class="search-scroll">
          <template v-if="loading && !results.length">
            <div v-for="n in 5" :key="n" class="search-skel-row">
              <div class="search-skel-cover" />
              <div class="search-skel-info">
                <div class="search-skel-title" />
                <div class="search-skel-sub" />
              </div>
              <div class="search-skel-btn" />
            </div>
          </template>

          <div v-if="!loading && !results.length" class="search-empty">
            <p class="search-empty-text">输入歌名或歌手名，搜索网易云曲库</p>
          </div>

          <div v-for="m in results" :key="m.id" class="search-result">
            <Music class="search-result-icon" />
            <div class="search-result-info">
              <div class="search-result-name">{{ m.name }}</div>
              <div class="search-result-artists">{{ artistNames(m) }} · {{ formatTime(m.duration) }}</div>
            </div>
            <div v-if="!savedIds.has(m.id)" @click="onSave(m)" class="search-save-btn"
              :class="{ 'search-save-btn--saving': savingIds.has(m.id) }">
              <Loader2 v-if="savingIds.has(m.id)" class="search-spinner" />
              <span v-else>保存</span>
            </div>
            <Check v-else class="search-saved-icon" />
          </div>

          <div v-if="results.length" class="search-bottom">
            <div v-if="results.length < total" @click="loadMore" class="search-load-more">
              <Loader2 v-if="loading" class="search-spinner" />
              <span>{{ loading ? 'Loading...' : 'Load More' }}</span>
            </div>
            <div v-else class="search-divider">
              <div class="search-divider-line" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { searchNetEase, saveMusic } from '../api/index.js'
import { showToast } from '../stores/toast.js'
import { Search, X, Loader2, Music, Check } from '@lucide/vue'
import { formatTime } from '../utils/format.js'

const show = ref(false)
const keyword = ref('')
const results = ref([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = 10
const loading = ref(false)
const savingIds = ref(new Set())
const savedIds = ref(new Set())

function open() { show.value = true; keyword.value = '' }
function close() { show.value = false }
defineExpose({ open, close })

async function doSearch(page = 1) {
  if (!keyword.value.trim()) return
  loading.value = true
  pageNo.value = page
  try {
    const res = await searchNetEase(keyword.value, page, pageSize)
    const songs = res.data.data.songs || []
    if (page === 1) {
      results.value = songs
    } else {
      results.value.push(...songs)
    }
    total.value = res.data.data.songCount || 0
  } finally {
    loading.value = false
  }
}

function onSearch() {
  results.value = []
  total.value = 0
  doSearch(1)
}

function loadMore() {
  doSearch(pageNo.value + 1)
}

async function onSave(music) {
  savingIds.value.add(music.id)
  try {
    await saveMusic(music.id)
    savedIds.value.add(music.id)
    showToast('已保存 ' + music.name, 'success')
  } finally {
    savingIds.value.delete(music.id)
  }
}

const artistNames = (m) => {
  const a = m.artists
  if (Array.isArray(a)) return a.map(x => x.name).join(',')
  return a || ''
}
</script>

<style lang="scss" scoped>
.search {
  &-overlay {
    position: fixed;
    z-index: 1;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 5rem;
  }

  &-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  &-panel {
    position: relative;
    background: var(--c-surface);
    border-radius: 0.75rem;
    width: 100%;
    max-width: 42rem;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    border: 1px solid var(--c-border);
    padding: 1.5rem;
  }

  &-close-row {
    display: flex;
    justify-content: flex-end;

    &-btn {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--c-text-sub);
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: var(--c-text);
      }
    }
  }

  &-input-wrap {
    margin-top: 1rem;
    position: relative;
  }

  &-input-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: var(--c-text-sub);
    pointer-events: none;
  }

  &-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
    line-height: 1;
    box-sizing: border-box;
    background: transparent;
    border: 1px solid var(--c-border);
    border-radius: 0.75rem;
    color: var(--c-text);
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder {
      color: var(--c-text-sub);
    }

    &:focus {
      border-color: var(--c-red);
      box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
    }
  }

  &-count {
    font-size: 0.75rem;
    color: var(--c-text-sub);
    margin-top: 0.5rem;
    margin-left: 0.25rem;
  }

  &-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 0 0.25rem;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-skel {
    &-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--c-border);
    }

    &-cover {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      flex-shrink: 0;
    }

    &-info {
      flex: 1;
      min-width: 0;
    }

    &-title {
      height: 0.875rem;
      border-radius: 0.375rem;
      width: 14rem;
      margin-bottom: 0.5rem;
    }

    &-sub {
      height: 0.75rem;
      border-radius: 0.375rem;
      width: 9rem;
    }

    &-btn {
      width: 3.5rem;
      height: 1.75rem;
      border-radius: 9999px;
      flex-shrink: 0;
    }
  }

  &-skel-cover,
  &-skel-title,
  &-skel-sub,
  &-skel-btn {
    background: linear-gradient(90deg, transparent 25%, var(--c-skeleton) 50%, transparent 75%);
    background-size: 200% 100%;
    animation: search-shimmer 1.5s ease-in-out infinite;
  }

  &-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    color: var(--c-text-sub);

    &-text {
      font-size: 0.875rem;
    }
  }

  &-result {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    cursor: pointer;
    border-bottom: 1px solid var(--c-border);
    transition: background 0.2s;

    &:hover {
      background: var(--c-hover);
    }

    &-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--c-text-sub);
      flex-shrink: 0;
    }

    &-info {
      flex: 1;
      min-width: 0;
    }

    &-name {
      font-size: 0.875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-artists {
      font-size: 0.75rem;
      color: var(--c-text-sub);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 2px;
    }
  }

  &-save-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid var(--c-border);
    color: var(--c-text-sub);
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;

    &:hover {
      color: #fff;
      background: var(--c-red);
      border-color: var(--c-red);
    }

    &--saving {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &-saved-icon {
    width: 1rem;
    height: 1rem;
    color: var(--c-green);
    flex-shrink: 0;
  }

  &-bottom {
    text-align: center;
    padding: 1rem 0;
  }

  &-load-more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: var(--c-text-sub);
    transition: color 0.2s;

    &:hover {
      color: var(--c-red);
    }
  }

  &-spinner {
    width: 0.875rem;
    height: 0.875rem;
    animation: spin 1s linear infinite;
  }

  &-divider {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;

    &-line {
      flex: 1;
      height: 1px;
      background: var(--c-border);
    }
  }
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes search-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.search-modal-enter-active,
.search-modal-leave-active { transition: opacity 0.3s ease; }
.search-modal-enter-from,
.search-modal-leave-to { opacity: 0; }

.search-panel {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.search-modal-enter-from .search-panel {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
.search-modal-leave-to .search-panel {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
</style>
