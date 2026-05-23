<template>
  <div class="skeleton-row">
    <div class="skeleton-index" />
    <div class="skeleton-cover" />
    <div class="skeleton-info">
      <div class="skeleton-title" />
      <div class="skeleton-sub" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem;
  border-radius: 0.75rem;

  .skeleton-index {
    width: 1.5rem;
    height: 0.75rem;
    border-radius: 0.375rem;
    flex-shrink: 0;
  }

  .skeleton-cover {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    flex-shrink: 0;
  }

  .skeleton-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .skeleton-title {
      height: 0.875rem;
      border-radius: 0.375rem;
      width: 12rem;
    }

    .skeleton-sub {
      height: 0.75rem;
      border-radius: 0.375rem;
      width: 8rem;
    }
  }
}

.skeleton-index,
.skeleton-cover,
.skeleton-title,
.skeleton-sub {
  background: linear-gradient(90deg, transparent 25%, var(--c-skeleton) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
