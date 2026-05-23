<template>
  <div class="empty-state">
    <p class="empty-title">音乐库为空</p>
    <p class="empty-hint">点击右上角「曲库」搜索歌曲并保存</p>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  color: var(--c-text-sub);

  &-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: var(--c-text-sub);
  }

  &-hint {
    font-size: 0.875rem;
    color: var(--c-text-sub);
  }
}
</style>
