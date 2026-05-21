<script setup>
import { ref } from 'vue'
import { searchNetEase, saveMusic } from '../api/index.js'
import { getMusicList } from '../api/index.js'
import { showToast } from '../stores/toast.js'
import SongRow from '../components/SongRow.vue'

const keyword = ref('')
const results = ref([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const savedIds = ref(new Set())

async function doSearch(page = 1) {
  if (!keyword.value.trim()) return
  loading.value = true
  pageNo.value = page
  try {
    const res = await searchNetEase(keyword.value, page, pageSize.value)
    results.value = res.data.data.list || []
    total.value = res.data.data.total || 0
    savedIds.value = new Set(
      (await getMusicList(1, Math.max(total.value, 200))).data.data.list.map(m => m.id)
    )
  } catch (e) {
    showToast('搜索失败: ' + (e.response?.data?.msg || e.message), 'error')
  } finally {
    loading.value = false
  }
}

function onSearch() {
  pageNo.value = 1
  doSearch(1)
}

async function onSave(music) {
  try {
    await saveMusic(music.id)
    savedIds.value.add(music.id)
    showToast('已保存 ' + music.name, 'success')
  } catch (e) {
    showToast('保存失败: ' + (e.response?.data?.msg || e.message), 'error')
  }
}
</script>

<template>
  <div class="py-6">
    <div class="flex gap-2 mb-6">
      <input v-model="keyword" @keyup.enter="onSearch" placeholder="搜索网易云歌曲..." class="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:border-emerald-500 transition-colors" />
      <button @click="onSearch" class="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium cursor-pointer transition-colors">搜索</button>
    </div>

    <div v-if="keyword && !loading && results.length === 0" class="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">没有找到相关歌曲</div>

    <div v-if="!keyword && results.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
      <svg viewBox="0 0 24 24" class="w-12 h-12 mb-4" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p class="text-sm">输入歌名或歌手名，搜索网易云曲库</p>
    </div>

    <div v-if="results.length" class="text-sm text-slate-500 dark:text-slate-400 mb-3">搜索结果 {{ total }} 首</div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-center gap-3 py-3 animate-pulse">
        <div class="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700" />
        <div class="flex-1 space-y-2">
          <div class="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div class="h-2 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>

    <SongRow
      v-for="m in results" :key="m.id"
      :music="m"
      :show-save="true"
      :saved="savedIds.has(m.id)"
      @save="onSave(m)"
    />

    <div v-if="total > pageSize" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in Math.ceil(total / pageSize)"
        :key="p"
        @click="doSearch(p)"
        class="w-8 h-8 rounded text-sm cursor-pointer transition-colors"
        :class="p === pageNo ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'"
      >{{ p }}</button>
    </div>

    <p v-if="keyword && !loading && total > 0" class="text-center text-slate-400 text-sm mt-6 cursor-pointer hover:text-emerald-500" @click="doSearch(pageNo + 1)">加载更多</p>
  </div>
</template>
