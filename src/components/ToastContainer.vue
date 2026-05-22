<template>
  <div class="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none">
    <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded-lg text-sm" :class="{
      'bg-green-500 text-white': t.type === 'success',
      'bg-red-500 text-white': t.type === 'error',
      'bg-neutral-800 text-white': t.type === 'info',
    }">{{ t.msg }}</div>
  </div>
</template>

<script setup>
import { toasts } from '../stores/toast.js'
</script>
