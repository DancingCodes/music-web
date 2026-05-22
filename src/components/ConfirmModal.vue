<script setup>
defineProps({ show: Boolean, message: String })
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('cancel')" />
      <div class="relative bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
        <p class="text-sm mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button @click="$emit('cancel')" class="px-4 py-1.5 rounded-lg text-sm border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors">取消</button>
          <button @click="$emit('confirm')" class="px-4 py-1.5 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-colors">确定删除</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
