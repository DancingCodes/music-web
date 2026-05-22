<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('cancel')" />
    <div class="relative bg-white rounded-xl px-6 py-4 border border-gray-200">
      <p class="text-sm mb-4">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <div @click="$emit('cancel')"
          class="px-4 py-1.5 rounded text-sm border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          取消
        </div>
        <div @click="$emit('confirm')"
          class="px-4 py-1.5 rounded text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-colors duration-200">
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, message: String })
defineEmits(['confirm', 'cancel'])
</script>
