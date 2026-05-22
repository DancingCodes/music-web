<template>
  <div class="fixed top-16 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded-xl text-sm" :class="{
        'bg-green-500 text-white': t.type === 'success',
        'bg-red-500 text-white': t.type === 'error',
        'bg-gray-800 dark:bg-gray-600 text-white': t.type === 'info',
      }">{{ t.msg }}</div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { toasts } from '../stores/toast.js'
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
