<script setup>
import { ref } from 'vue'
import { searchNetEase, saveMusic } from '../api/index.js'
import { showToast } from '../stores/toast.js'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import SearchSongRow from '../components/SearchSongRow.vue'

const keyword = ref('')
const results = ref([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const savingIds = ref(new Set())
const savedIds = ref(new Set())

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
</script>

<template>
  <div class="py-6">
    <div class="flex gap-2 mb-6">
      <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云歌曲..." class="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm outline-none focus:border-emerald-500 transition-colors" />
      <button @click="onSearch" class="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium cursor-pointer transition-colors">搜索</button>
    </div>

    <div v-if="keyword && !loading && results.length === 0" class="text-center py-16 text-zinc-400 dark:text-zinc-500 text-sm">没有找到相关歌曲</div>

    <div v-if="!keyword && results.length === 0" class="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
      <MagnifyingGlassIcon class="w-12 h-12 mb-4" />
      <p class="text-sm">输入歌名或歌手名，搜索网易云曲库</p>
    </div>

    <div v-if="results.length" class="text-sm text-zinc-500 dark:text-zinc-400 mb-3">搜索结果 {{ total }} 首</div>

    <div v-if="loading" class="text-center py-10 text-zinc-400 text-sm">加载中...</div>

    <SearchSongRow
      v-for="m in results" :key="m.id"
      :music="m"
      :saved="savedIds.has(m.id)"
      :saving="savingIds.has(m.id)"
      @save="onSave(m)"
    />

    <div v-if="results.length < total" class="text-center mt-6">
      <button @click="loadMore" :disabled="loading" class="text-sm text-zinc-500 hover:text-emerald-500 cursor-pointer disabled:opacity-30">{{ loading ? '加载中...' : '加载更多' }}</button>
    </div>

  </div>
</template>
