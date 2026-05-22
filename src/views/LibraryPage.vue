<template>
  <div class="h-full flex flex-col">
    <div class="shrink-0 pb-6 border-b border-neutral-800 mb-4">
      <div class="flex gap-2.5">
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="筛选歌曲..."
          class="flex-1 h-10 px-4 rounded-lg box-border bg-transparent border border-solid border-neutral-700 text-white text-sm outline-none" />
        <div @click="onSearch"
          class="h-10 px-5 rounded-lg flex items-center text-sm text-white cursor-pointer bg-red hover:bg-red-600">
          搜索
        </div>
        <div @click="searchModal?.open()"
          class="h-10 px-4 rounded-lg flex items-center border border-neutral-700 text-sm text-white cursor-pointer">
          曲库
        </div>
      </div>
      <div v-if="total" class="text-xs text-neutral mt-3 ml-1">{{ total }} 首歌</div>
    </div>

    <div class="flex-1 overflow-y-auto" style="scrollbar-width:none;-ms-overflow-style:none">
      <div v-if="loading" class="text-center py-16 text-neutral text-sm">加载中...</div>

      <EmptyState v-if="!loading && !total" @search="searchModal?.open()" />

      <div <SongRow v-for="(m, i) in list" :key="m.id" :music="m" :index="i + 1" @play="play(m, list)"
        @delete="deleting = m" />
    </div>

    <div v-if="list.length" class="text-center pt-8 pb-4">
      <div v-if="list.length < total" @click="loadMore" class="flex items-center gap-1 text-sm cursor-pointer"
        :class="loading ? 'text-neutral-600 pointer-events-none' : 'text-neutral-400 hover:text-red'">
        <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin" />
        <span>加载更多</span>
      </div>
      <div v-else class="text-sm text-neutral-600">没有更多了</div>
    </div>
  </div>

  <ConfirmModal :show="deleting" message="确定删除" @confirm="confirmDelete" @cancel="deleting = null" />

  <SearchModal ref="searchModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2 } from '@lucide/vue'
import { getMusicList, deleteMusic } from '../api/index.js'
import { play, player } from '../stores/player.js'
import { showToast } from '../stores/toast.js'

import SongRow from '../components/SongRow.vue'
import EmptyState from '../components/EmptyState.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import SearchModal from '../components/SearchModal.vue'

const list = ref([])
const total = ref(0)
const keyword = ref('')
const pageNo = ref(1)
const pageSize = 10
const deleting = ref(null)
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
  } finally {
    loading.value = false
  }
}

function onSearch() {
  pageNo.value = 1
  list.value = []
  total.value = 0
  load(1)
}

function loadMore() {
  load(pageNo.value + 1, true)
  pageNo.value++
}

async function confirmDelete() {
  if (!deleting.value) return
  try {
    await deleteMusic(deleting.value.id)
    showToast('已删除', 'success')
    load()
  } finally {
    deleting.value = null
  }
}

onMounted(load)
</script>
