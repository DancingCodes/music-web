<template>
  <div class="library">
    <div class="library-toolbar">
      <div class="library-search-wrap">
        <Search class="library-search-icon" />
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索歌曲或歌手" class="library-search-input" />
      </div>
      <div @click="onSearch" class="library-search-btn">搜索</div>
      <div @click="searchModal?.open()" class="library-cloud-btn">曲库</div>
      <div @click="toggleTheme" class="library-theme-btn">
        <Transition name="theme-icon" mode="out-in">
          <Sun v-if="theme === 'dark'" key="sun" class="library-theme-icon" />
          <Moon v-else key="moon" class="library-theme-icon" />
        </Transition>
      </div>
    </div>
    <div v-if="total" class="library-total">{{ total }} 首歌</div>
    <div class="library-scroll">
      <SkeletonRow v-if="loading" v-for="n in 6" :key="n" />
      <EmptyState v-if="!loading && total === 0" />
      <SongRow v-for="(m, i) in list" :key="m.id" :music="m" :index="i + 1" @play="play(m, list)"
        @delete="deleting = m" />
      <div v-if="list.length" class="library-bottom">
        <div v-if="list.length < total" @click="loadMore" class="library-load-more"
          :class="{ 'library-load-more--disabled': loading }">
          <Loader2 v-if="loading" class="library-spinner" />
          <span>{{ loading ? 'Loading...' : 'Load More' }}</span>
        </div>
        <div v-else class="library-divider">
          <div class="library-divider-line" />
        </div>
      </div>
    </div>

    <ConfirmModal :show="!!deleting" :loading="deletingLoading" message="确定删除?" @confirm="confirmDelete" @cancel="deleting = null" />

    <SearchModal ref="searchModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, Sun, Moon, Search } from '@lucide/vue'
import { getMusicList, deleteMusic } from '../api/index.js'
import { play, player } from '../stores/player.js'
import { showToast } from '../stores/toast.js'
import { theme, toggleTheme } from '../stores/theme.js'

import SongRow from '../components/SongRow.vue'
import SkeletonRow from '../components/SkeletonRow.vue'
import EmptyState from '../components/EmptyState.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import SearchModal from '../components/SearchModal.vue'

const list = ref([])
const total = ref(0)
const keyword = ref('')
const pageNo = ref(1)
const pageSize = 20
const deleting = ref(null)
const deletingLoading = ref(false)
const loading = ref(true)
const searchModal = ref(null)

async function load(page = 1, append = false) {
  loading.value = true
  try {
    const res = await getMusicList(page, pageSize, keyword.value)
    const songs = res.data.data.list || []
    if (append) {
      list.value.push(...songs)
    } else {
      list.value = songs
      if (songs.length && !player.current) {
        player.current = songs[0]
        player.queue = songs
      }
    }
    total.value = res.data.data.total || 0
    pageNo.value = page
  } finally {
    loading.value = false
  }
}

function onSearch() {
  list.value = []
  total.value = 0
  load(1)
}

function loadMore() {
  load(pageNo.value + 1, true)
}

async function confirmDelete() {
  if (!deleting.value) return
  deletingLoading.value = true
  try {
    await deleteMusic(deleting.value.id)
    showToast('已删除', 'success')
    load(1)
  } finally {
    deleting.value = null
    deletingLoading.value = false
  }
}

onMounted(load)
</script>

<style lang="scss" scoped>
.library {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow: hidden;

  &-toolbar {
    display: flex;
    gap: 0.625rem;
  }

  &-search {
    &-wrap {
      flex: 1;
      position: relative;
    }

    &-icon {
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
      height: 2.5rem;
      padding: 0 1rem 0 2.25rem;
      border-radius: 0.75rem;
      box-sizing: border-box;
      background: transparent;
      border: 1px solid var(--c-border);
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

    &-btn {
      height: 2.5rem;
      padding: 0 1.25rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      color: #fff;
      cursor: pointer;
      background: linear-gradient(to right, var(--c-red), var(--c-rose-400));
      transition: box-shadow 0.2s, transform 0.2s;

      &:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: scale(1.02);
      }
    }
  }

  &-cloud-btn {
    height: 2.5rem;
    padding: 0 1rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    border: 1px solid var(--c-border);
    font-size: 0.875rem;
    color: var(--c-text);
    cursor: pointer;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--c-text-sub);
    }
  }

  &-theme {
    &-btn {
      height: 2.5rem;
      width: 2.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--c-border);
      color: var(--c-text-sub);
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: var(--c-text);
      }
    }

    &-icon {
      width: 1rem;
      height: 1rem;
    }
  }

  &-total {
    font-size: 0.75rem;
    color: var(--c-text-sub);
    margin-top: 0.75rem;
    margin-left: 0.25rem;
  }

  &-scroll {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-bottom {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }

  &-load-more {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    cursor: pointer;
    color: var(--c-text-sub);
    transition: color 0.2s;

    &:hover {
      color: var(--c-red);
    }

    &--disabled {
      color: var(--c-text-sub);
      pointer-events: none;
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

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: transform 0.35s ease, opacity 0.25s ease;
}
.theme-icon-enter-from {
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
}
.theme-icon-leave-to {
  transform: rotate(90deg) scale(0.5);
  opacity: 0;
}
</style>
