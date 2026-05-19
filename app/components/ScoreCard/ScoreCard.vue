<script setup lang="ts">
import './ScoreCard.css'
import type { ScoreBreakdown } from '#core/interfaces/types'

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
