<script setup>
import { ref } from 'vue'
import { searchNetEase, saveMusic } from '../api/index.js'
import { showToast } from '../stores/toast.js'
import { IconSearch, IconClose, IconSpinner } from '../utils/icons.js'
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
  } catch {
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
  } catch {
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

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-start justify-center pt-20" @click.self="close">
      <div class="absolute inset-0 bg-black/40" />
      <div class="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[70vh] flex flex-col mx-4 shadow-2xl">
        <div class="flex items-center gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <IconSearch class="w-5 h-5 text-zinc-400 shrink-0" />
          <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云歌曲..." class="flex-1 bg-transparent text-sm outline-none" />
          <button @click="close" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer">
            <IconClose class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 scrollbar-hide" style="scrollbar-width:none;-ms-overflow-style:none">
          <div v-if="keyword && !loading && results.length === 0" class="text-center py-16 text-zinc-400 text-sm">没有找到相关歌曲</div>

          <div v-if="!keyword && results.length === 0" class="flex flex-col items-center justify-center py-16 text-zinc-400">
            <IconSearch class="w-10 h-10 mb-3" />
            <p class="text-sm">输入歌名或歌手名，搜索网易云曲库</p>
          </div>

          <div v-if="results.length" class="text-sm text-zinc-500 dark:text-zinc-400 py-3">搜索结果 {{ total }} 首</div>

          <div v-if="loading" class="text-center py-10 text-zinc-400 text-sm">加载中...</div>

          <div
            v-for="m in results" :key="m.id"
            class="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ m.name }}</div>
              <div class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ artistNames(m) }} · {{ formatTime(m.duration) }}</div>
            </div>
            <button
              v-if="!savedIds.has(m.id)"
              :disabled="savingIds.has(m.id)"
              @click="onSave(m)"
              class="text-xs px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer transition-colors disabled:opacity-50"
            >
              <IconSpinner v-if="savingIds.has(m.id)" class="w-3.5 h-3.5 animate-spin" />
              <span v-else>保存</span>
            </button>
            <span v-else class="text-xs text-zinc-400">已保存</span>
          </div>

          <div v-if="results.length < total" class="text-center py-4">
            <button @click="loadMore" :disabled="loading" class="text-sm text-zinc-500 hover:text-emerald-500 cursor-pointer disabled:opacity-30">{{ loading ? '加载中...' : '加载更多' }}</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
