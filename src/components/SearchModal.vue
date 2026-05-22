<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-start justify-center pt-20" @click.self="close">
    <div class="absolute inset-0 bg-black/50" />
    <div
      class="relative bg-neutral-900 rounded-lg w-full max-w-2xl max-h-[70vh] flex flex-col mx-4 border border-neutral-800">
      <div @click="close" class="absolute top-3 right-3 text-neutral-500 hover:text-neutral-300 cursor-pointer z-10">
        <X class="w-5 h-5" />
      </div>
      <div class="flex items-center gap-3 px-4 h-12 border-b border-neutral-800">
        <Search class="w-4 h-4 text-neutral-500 shrink-0" />
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云歌曲..."
          class="flex-1 h-10 px-4 box-border bg-transparent border border-solid border-neutral-700 rounded-lg text-white text-sm outline-none placeholder:text-neutral-500" />
      </div>

      <div class="flex-1 overflow-y-auto px-4 pt-3" style="scrollbar-width:none;-ms-overflow-style:none">
        <div v-if="keyword && !loading && results.length === 0" class="text-center py-16 text-neutral-500 text-sm">
          没有找到相关歌曲</div>

        <div v-if="!keyword && results.length === 0"
          class="flex flex-col items-center justify-center py-16 text-neutral-500">
          <Search class="w-8 h-8 mb-3" />
          <p class="text-sm">输入歌名或歌手名，搜索网易云曲库</p>
        </div>

        <div v-if="results.length" class="text-xs text-neutral-500 py-3">{{ total }} 首结果</div>

        <div v-if="loading" class="text-center py-10 text-neutral-500 text-sm">加载中...</div>

        <div v-for="m in results" :key="m.id" class="flex items-center gap-3 py-3 border-b border-neutral-800">
          <div class="flex-1 min-w-0">
            <div class="text-sm truncate">{{ m.name }}</div>
            <div class="text-xs text-neutral-500 truncate mt-0.5">{{ artistNames(m) }} · {{ formatTime(m.duration) }}
            </div>
          </div>
          <div v-if="!savedIds.has(m.id)" @click="onSave(m)"
            class="text-xs px-3 py-1 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer"
            :class="{ 'opacity-50 pointer-events-none': savingIds.has(m.id) }">
            <Loader2 v-if="savingIds.has(m.id)" class="w-3.5 h-3.5 animate-spin" />
            <span v-else>保存</span>
          </div>
          <span v-else class="text-xs text-neutral-600">已保存</span>
        </div>

        <div v-if="results.length > 0" class="text-center py-4">
          <div v-if="results.length < total" @click="loadMore"
            class="text-sm cursor-pointer text-neutral-400 hover:text-red-500">{{ loading ? '加载中...' : '加载更多' }}</div>
          <div v-else class="text-sm text-neutral-600">没有更多了</div>
        </div>
      </div>
    </div>
  </div>
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
