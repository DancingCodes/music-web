<template>
  <Transition name="confirm-modal">
    <div v-if="show" class="confirm-overlay">
      <div class="confirm-backdrop" @click="loading ? null : $emit('cancel')" />
      <div class="confirm-panel">
        <p class="confirm-message">{{ message }}</p>
        <div class="confirm-actions">
          <button @click="loading ? null : $emit('cancel')" class="btn-cancel" :class="{ 'btn-disabled': loading }">
            取消
          </button>
          <button @click="loading ? null : $emit('confirm')" class="btn-confirm" :class="{ 'btn-disabled': loading }">
            <Loader2 v-if="loading" class="btn-spinner" />
            <span>确定</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Loader2 } from '@lucide/vue'
defineProps({ show: Boolean, message: String, loading: Boolean })
defineEmits(['confirm', 'cancel'])
</script>

<style lang="scss" scoped>
.confirm {
  &-overlay {
    position: fixed;
    z-index: 50;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  &-panel {
    position: relative;
    background: var(--c-surface);
    border-radius: 0.75rem;
    padding: 1.5rem 1rem;
    border: 1px solid var(--c-border);
    min-width: 280px;
    color: var(--c-text);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
  }

  &-message {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
}

.btn-cancel {
  padding: 0.375rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  border: 1px solid var(--c-border);
  color: var(--c-text-sub);
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: var(--c-hover);
  }
}

.btn-confirm {
  padding: 0.375rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  border: none;
  background: var(--c-red);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.btn-spinner {
  width: 0.875rem;
  height: 0.875rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.3s ease;
}
.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
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
