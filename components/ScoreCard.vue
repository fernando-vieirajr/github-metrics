<script setup lang="ts">
import type { ScoreBreakdown } from '../interfaces/types'

defineProps<{ score: ScoreBreakdown | null; loading: boolean }>()

const dimensions = [
  { key: 'activity' as const, label: 'Activity', max: 350, color: '#3b82f6' },
  { key: 'impact' as const, label: 'Impact', max: 350, color: '#10b981' },
  { key: 'diversity' as const, label: 'Diversity', max: 200, color: '#8b5cf6' },
  { key: 'engagement' as const, label: 'Engagement', max: 100, color: '#f59e0b' },
]
</script>

<template>
  <div class="score-card">
    <h2 class="score-card__title">Score Breakdown</h2>
    <template v-if="loading">
      <AppSkeleton v-for="i in 4" :key="i" height="32px" style="margin-bottom: 12px" />
    </template>
    <template v-else-if="score">
      <div v-for="dim in dimensions" :key="dim.key" class="score-card__row">
        <div class="score-card__label">{{ dim.label }}</div>
        <div class="score-card__bar-wrap">
          <div
            class="score-card__bar"
            :style="{
              width: `${(score[dim.key] / dim.max) * 100}%`,
              background: dim.color,
            }"
          />
        </div>
        <div class="score-card__value">{{ score[dim.key] }}<span class="score-card__max">/{{ dim.max }}</span></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.score-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.score-card__title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 14px;
}
.score-card__row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.score-card__label {
  width: 90px;
  font-size: 0.8125rem;
  color: #374151;
  flex-shrink: 0;
}
.score-card__bar-wrap {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}
.score-card__bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}
.score-card__value {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #111827;
  min-width: 60px;
  text-align: right;
}
.score-card__max {
  font-weight: 400;
  color: #9ca3af;
}
</style>
