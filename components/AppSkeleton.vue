<script setup lang="ts">
defineProps<{ width?: string; height?: string; rounded?: boolean }>()
</script>

<template>
  <div
    class="skeleton"
    :style="{ width: width ?? '100%', height: height ?? '16px', borderRadius: rounded ? '50%' : '4px' }"
  />
</template>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
