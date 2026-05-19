<script setup lang="ts">
import type { GithubProfile } from '../interfaces/types'

const props = defineProps<{ profile: GithubProfile | null; loading: boolean }>()
</script>

<template>
  <div class="activity-timeline">
    <template v-if="loading">
      <AppSkeleton v-for="i in 4" :key="i" height="40px" style="margin-bottom: 10px" />
    </template>
    <template v-else-if="props.profile">
      <div class="activity-timeline__grid">
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">{{ props.profile.commitsThisYear }}</div>
          <div class="activity-timeline__label">Commits this year</div>
        </div>
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">{{ props.profile.pullRequestsMerged }}</div>
          <div class="activity-timeline__label">Pull Requests</div>
        </div>
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">{{ props.profile.issuesClosed }}</div>
          <div class="activity-timeline__label">Issues</div>
        </div>
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">{{ props.profile.codeReviews }}</div>
          <div class="activity-timeline__label">Code Reviews</div>
        </div>
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">🔥 {{ props.profile.streakDays }}</div>
          <div class="activity-timeline__label">Current Streak (days)</div>
        </div>
        <div class="activity-timeline__stat">
          <div class="activity-timeline__value">{{ props.profile.activeDays }}</div>
          <div class="activity-timeline__label">Active Days</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.activity-timeline__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}
.activity-timeline__stat {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}
.activity-timeline__value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.activity-timeline__label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
}
</style>
