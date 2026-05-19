<script setup lang="ts">
import type { Language } from '../shared/types'

defineProps<{ languages: Language[] | null; loading: boolean }>()
</script>

<template>
  <div class="lang-bar">
    <h2 class="lang-bar__title">Languages</h2>
    <template v-if="loading">
      <AppSkeleton height="8px" style="margin-bottom: 10px" />
      <AppSkeleton width="70%" height="12px" />
    </template>
    <template v-else-if="languages && languages.length > 0">
      <div class="lang-bar__track">
        <div
          v-for="lang in languages"
          :key="lang.name"
          class="lang-bar__segment"
          :style="{ width: `${lang.percentage}%`, background: lang.color || '#d1d5db' }"
          :title="`${lang.name}: ${lang.percentage}%`"
        />
      </div>
      <div class="lang-bar__legend">
        <span v-for="lang in languages.slice(0, 6)" :key="lang.name" class="lang-bar__item">
          <span class="lang-bar__dot" :style="{ background: lang.color || '#d1d5db' }" />
          {{ lang.name }} {{ lang.percentage }}%
        </span>
      </div>
    </template>
    <p v-else class="lang-bar__empty">No language data available</p>
  </div>
</template>

<style scoped>
.lang-bar {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.lang-bar__title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px;
}
.lang-bar__track {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}
.lang-bar__segment {
  height: 100%;
}
.lang-bar__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.lang-bar__item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  color: #374151;
}
.lang-bar__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.lang-bar__empty {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}
</style>
