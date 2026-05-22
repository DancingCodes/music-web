<template>
  <Transition name="search-modal">
    <div v-if="show" class="fixed z-1 inset-0 flex items-start justify-center pt-20" @click.self="close">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        class="relative bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[70vh] flex flex-col mx-4 border border-gray-200 dark:border-gray-700 p-6 search-modal-panel">
      <div class="flex justify-end">
        <X @click="close" class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer" />
      </div>

      <div class="mt-4 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云歌曲..."
          class="w-full pl-9 pr-4 py-2 leading-0 box-border bg-transparent border border-solid border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-red focus:ring-1 focus:ring-red/20 transition-colors duration-200" />
      </div>

      <div v-if="results.length" class="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">{{ total }} 首结果</div>

      <div class="flex-1 overflow-y-auto px-1 [&::-webkit-scrollbar]:hidden" style="scrollbar-width:none;-ms-overflow-style:none">
        <template v-if="loading && !results.length">
          <div v-for="n in 5" :key="n" class="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700">
            <div class="flex-1 min-w-0 space-y-2">
              <div class="h-3.5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse w-56" />
              <div class="h-3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse w-36" />
            </div>
            <div class="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
          </div>
        </template>

        <div v-if="keyword && !loading && !results.length" class="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">
          没有找到相关歌曲</div>

        <div v-if="!keyword && !results.length" class="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <Search class="w-8 h-8 mb-3" />
          <p class="text-sm">输入歌名或歌手名，搜索网易云曲库</p>
        </div>

        <div v-for="m in results" :key="m.id" class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <div class="flex-1 min-w-0">
            <div class="text-sm truncate">{{ m.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ artistNames(m) }} · {{ formatTime(m.duration) }}
            </div>
          </div>
          <div v-if="!savedIds.has(m.id)" @click="onSave(m)"
            class="text-xs px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-colors duration-200"
            :class="{ 'opacity-50 pointer-events-none': savingIds.has(m.id) }">
            <Loader2 v-if="savingIds.has(m.id)" class="w-3.5 h-3.5 animate-spin" />
            <span v-else>保存</span>
          </div>
          <span v-else class="text-xs text-gray-400 dark:text-gray-500">已保存</span>
        </div>

        <div v-if="results.length" class="text-center py-4">
          <div v-if="results.length < total" @click="loadMore"
            class="flex items-center justify-center gap-1 text-sm cursor-pointer text-gray-600 dark:text-gray-400 hover:text-red dark:hover:text-red-400 transition-colors duration-200">
            <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin" />
            <span>{{ loading ? 'Loading...' : 'Load More' }}</span>
          </div>
          <div v-else class="flex items-center py-2">
            <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
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
import { Search, X, Loader2 } from '@lucide/vue'
import { formatTime } from '../utils/format.js'

const show = ref(false)
const keyword = ref('')
const results = ref([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const savingIds = ref(new Set())
const savedIds = ref(new Set())

function open() { show.value = true }
function close() { show.value = false }
defineExpose({ open, close })

async function doSearch(page = 1) {
  if (!keyword.value.trim()) return
  loading.value = true
  pageNo.value = page
  try {
    const res = await searchNetEase(keyword.value, page, pageSize.value)
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
  if (savedIds.value.has(music.id)) {
    showToast('歌曲已收藏')
    return
  }
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

<style scoped>
.search-modal-enter-active,
.search-modal-leave-active {
  transition: opacity 0.2s ease;
}
.search-modal-enter-from,
.search-modal-leave-to {
  opacity: 0;
}

.search-modal-panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.search-modal-enter-from .search-modal-panel {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
.search-modal-leave-to .search-modal-panel {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
</style>
