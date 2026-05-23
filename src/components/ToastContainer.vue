<template>
  <div class="toast-container">
    <div v-for="t in toasts" :key="t.id" class="toast-item" :class="{
      'toast-success': t.type === 'success',
      'toast-error': t.type === 'error',
      'toast-info': t.type === 'info',
    }">{{ t.msg }}</div>
  </div>
</template>

<script setup>
import { toasts } from '../stores/toast.js'
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

.toast-item {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  color: #fff;
}

.toast-success {
  background: rgba(34, 197, 94, 0.8);
}

.toast-error {
  background: rgba(239, 68, 68, 0.8);
}

.toast-info {
  background: rgba(31, 41, 55, 0.8);
}


</style>
