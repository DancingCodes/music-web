<template>
  <div class="flex flex-col items-center justify-center py-24 text-neutral-600">
    <Music class="w-12 h-12 mb-5" />
    <p class="text-sm mb-5">还没有收藏歌曲</p>
    <div
      @click="$emit('search')"
      class="text-sm px-5 h-9 flex items-center rounded-full text-white cursor-pointer bg-red hover:bg-red-600"
    >去搜索吧</div>
  </div>
</template>

<script setup>
import { Music } from '@lucide/vue'
</script>
