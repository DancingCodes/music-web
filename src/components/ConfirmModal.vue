<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')" />
    <div class="relative bg-white rounded-lg p-6 max-w-sm mx-4 border border-gray-500">
      <p class="text-sm mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <div @click="$emit('cancel')"
          class="px-4 py-1.5 rounded text-sm border border-gray-500 text-gray-500 hover:bg-gray-500 cursor-pointer">
          取消
        </div>
        <div @click="$emit('confirm')"
          class="px-4 py-1.5 rounded text-sm bg-red-500 hover:bg-red-500 text-white cursor-pointer">
          确定删除
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ show: Boolean, message: String })
defineEmits(['confirm', 'cancel'])
</script>
