<script setup lang="ts">
import './AppSkeleton.css'
defineProps<{ width?: string; height?: string; rounded?: boolean }>()
</script>

<template>
  <div
    class="skeleton"
    :style="{ width: width ?? '100%', height: height ?? '16px', borderRadius: rounded ? '50%' : '4px' }"
  />
</template>
