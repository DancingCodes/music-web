<template>
  <Transition name="confirm-modal">
    <div v-if="show" class="fixed z-50 inset-0 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')" />
      <div class="relative bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl px-6 py-4 border border-gray-200 dark:border-gray-700 min-w-[280px] confirm-panel">
        <p class="text-sm mb-4">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <div @click="$emit('cancel')"
            class="px-4 py-1.5 rounded text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
            取消
          </div>
          <div @click="$emit('confirm')"
            class="px-4 py-1.5 rounded text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-colors duration-200">
            确定
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ show: Boolean, message: String })
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
}

.confirm-panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.confirm-modal-enter-from .confirm-panel {
  transform: scale(0.95);
  opacity: 0;
}
.confirm-modal-leave-to .confirm-panel {
  transform: scale(0.95);
  opacity: 0;
}
</style>
