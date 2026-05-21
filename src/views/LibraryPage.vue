<script setup>
import { ref, onMounted } from 'vue'
import { getMusicList, deleteMusic } from '../api/index.js'
import { showToast } from '../stores/toast.js'
import SongRow from '../components/SongRow.vue'
import EmptyState from '../components/EmptyState.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const list = ref([])
const total = ref(0)
const keyword = ref('')
const pageNo = ref(1)
const deleting = ref(null)

async function load() {
  try {
    const res = await getMusicList(pageNo.value, 10, keyword.value)
    list.value = res.data.data.list || []
    total.value = res.data.data.total || 0
  } catch (e) {
    showToast('加载失败', 'error')
  }
}

function onSearch() {
  pageNo.value = 1
  load()
}

async function confirmDelete() {
  if (!deleting.value) return
  try {
    await deleteMusic(deleting.value.id)
    showToast('已删除', 'success')
    deleting.value = null
    load()
  } catch (e) {
    showToast('删除失败', 'error')
  }
}

onMounted(load)
</script>

<template>
  <div class="py-6">
    <div class="flex gap-2 mb-6">
      <input v-model="keyword" @input="onSearch" placeholder="筛选歌曲..." class="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:border-emerald-500 transition-colors" />
      <div class="flex items-center text-sm text-slate-500 dark:text-slate-400 px-3">共 {{ total }} 首</div>
    </div>

    <EmptyState v-if="total === 0" />

    <SongRow
      v-for="m in list" :key="m.id"
      :music="m"
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
  </div>
</template>
