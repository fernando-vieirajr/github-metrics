<script setup lang="ts">
import './RepoList.css'
import type { Repo } from '#core/interfaces/types'

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
