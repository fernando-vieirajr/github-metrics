<script setup lang="ts">
import './LanguageBar.css'
import type { Language } from '#core/interfaces/types'

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
