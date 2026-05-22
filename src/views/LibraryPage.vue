<template>
  <div class="flex-1 flex flex-col p-6 overflow-hidden">
    <div class="flex gap-2.5">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input v-model="keyword" @keyup.enter="onSearch" placeholder="请输入歌曲或歌手名称"
          class="w-full h-10 pl-9 pr-4 rounded-xl box-border bg-transparent border border-solid border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-red focus:ring-1 focus:ring-red/20 transition-colors duration-200" />
      </div>
      <div @click="onSearch"
        class="h-10 px-5 rounded-xl flex items-center text-sm text-white cursor-pointer bg-gradient-to-r from-red-500 to-rose-400 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
        搜索</div>
      <div @click="searchModal?.open()"
        class="h-10 px-4 rounded-xl flex items-center border border-gray-300 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200">
        曲库</div>
      <div @click="toggleTheme"
        class="h-10 w-10 rounded-xl flex items-center justify-center border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200">
        <Sun v-if="theme === 'dark'" class="w-4 h-4" />
        <Moon v-else class="w-4 h-4" />
      </div>
    </div>
    <div v-if="total" class="text-xs text-gray-500 dark:text-gray-400 mt-3 ml-1">{{ total }} 首歌</div>
    <div class="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style="scrollbar-width:none;-ms-overflow-style:none">
      <SkeletonRow v-if="loading" v-for="n in 6" :key="n" />
      <EmptyState v-if="!loading && total === 0" @search="searchModal?.open()" />
      <SongRow v-for="(m, i) in list" :key="m.id" :music="m" :index="i + 1" @play="play(m, list)"
        @delete="deleting = m" />
      <div v-if="list.length" class="flex justify-center py-4">
        <div v-if="list.length < total" @click="loadMore" class="flex items-center gap-1 py-2 px-4 text-sm cursor-pointer transition-colors duration-200"
          :class="loading ? 'text-gray-400 dark:text-gray-500 pointer-events-none' : 'text-gray-600 dark:text-gray-400 hover:text-red dark:hover:text-red-400'">
          <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin" />
          <span>{{ loading ? 'Loading...' : 'Load More' }}</span>
        </div>
        <div v-else class="flex items-center py-2">
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>

    <ConfirmModal :show="deleting" message="确定删除?" @confirm="confirmDelete" @cancel="deleting = null" />

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
