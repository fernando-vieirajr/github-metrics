<script setup lang="ts">
import type { Repo } from '../shared/types'

defineProps<{ repos: Repo[] | null; loading: boolean }>()

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
</script>

<template>
  <div class="repo-list">
    <template v-if="loading">
      <AppSkeleton v-for="i in 5" :key="i" height="52px" style="margin-bottom: 8px" />
    </template>
    <template v-else-if="repos && repos.length > 0">
      <a
        v-for="repo in repos"
        :key="repo.name"
        :href="repo.url"
        target="_blank"
        rel="noopener"
        class="repo-list__item"
      >
        <div class="repo-list__info">
          <span class="repo-list__name">{{ repo.name }}</span>
          <span v-if="repo.primaryLanguage" class="repo-list__lang">
            <span class="repo-list__lang-dot" :style="{ background: repo.primaryLanguage.color }" />
            {{ repo.primaryLanguage.name }}
          </span>
          <p v-if="repo.description" class="repo-list__desc">{{ repo.description }}</p>
        </div>
        <div class="repo-list__stats">
          <span>⭐ {{ formatNumber(repo.stargazerCount) }}</span>
          <span>🍴 {{ formatNumber(repo.forkCount) }}</span>
          <span>👁 {{ formatNumber(repo.watcherCount) }}</span>
        </div>
      </a>
    </template>
    <p v-else class="repo-list__empty">No repositories found</p>
  </div>
</template>

<style scoped>
.repo-list__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  text-decoration: none;
  transition: background 0.15s;
}
.repo-list__item:hover { background: #f3f4f6; }
.repo-list__info { flex: 1; min-width: 0; }
.repo-list__name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
}
.repo-list__lang {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 10px;
}
.repo-list__lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.repo-list__desc {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 4px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.repo-list__stats {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
  margin-left: 12px;
}
.repo-list__empty { font-size: 0.875rem; color: #9ca3af; }
</style>
