<script setup>
import { toasts } from '../stores/toast.js'
</script>

<template>
  <div class="fixed top-16 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="px-4 py-2 rounded-lg text-sm shadow-lg transition-all"
      :class="{
        'bg-emerald-500 text-white': t.type === 'success',
        'bg-red-500 text-white': t.type === 'error',
        'bg-slate-700 text-white': t.type === 'info',
      }"
    >{{ t.msg }}</div>
  </div>
</template>
