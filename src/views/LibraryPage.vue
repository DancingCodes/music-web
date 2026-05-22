<script setup>
import { ref, onMounted } from 'vue'
import { getMusicList, deleteMusic } from '../api/index.js'
import { play } from '../stores/player.js'
import { showToast } from '../stores/toast.js'

import SongRow from '../components/SongRow.vue'
import EmptyState from '../components/EmptyState.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import SearchModal from '../components/SearchModal.vue'

const list = ref([])
const total = ref(0)
const keyword = ref('')
const pageNo = ref(1)
const deleting = ref(null)
const loading = ref(true)
const searchModal = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await getMusicList(pageNo.value, 10, keyword.value)
    list.value = res.data.data.list || []
    total.value = res.data.data.total || 0
  } catch {
  } finally {
    loading.value = false
  }
}

function onSearch() {
  pageNo.value = 1
  list.value = []
  total.value = 0
  load()
}

async function confirmDelete() {
  if (!deleting.value) return
  try {
    await deleteMusic(deleting.value.id)
    showToast('已删除', 'success')
    deleting.value = null
    load()
  } catch {
  }
}

onMounted(load)
</script>

<template>
  <div class="py-6">
    <div class="mb-6">
      <div class="flex gap-2">
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="筛选歌曲..." class="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm outline-none focus:border-emerald-500 transition-colors" />
        <button @click="onSearch" class="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium cursor-pointer transition-colors">搜索</button>
        <button @click="searchModal?.open()" class="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">曲库</button>
      </div>
      <div v-if="total > 0" class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">共 {{ total }} 首</div>
    </div>

    <div v-if="loading" class="text-center py-10 text-zinc-400 text-sm">加载中...</div>

    <EmptyState v-if="!loading && total === 0" @search="searchModal?.open()" />

    <SongRow
      v-for="m in list" :key="m.id"
      :music="m"
      @play="play(m, list)"
      @delete="deleting = m"
    >
      <template #actions />
    </SongRow>

    <ConfirmModal
      :show="!!deleting"
      :message="deleting ? '确定删除 ' + deleting.name + '？同时会删除云端文件' : ''"
      @confirm="confirmDelete"
      @cancel="deleting = null"
    />

    <SearchModal ref="searchModal" />
  </div>
</template>
