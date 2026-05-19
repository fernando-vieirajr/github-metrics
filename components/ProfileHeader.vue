<script setup lang="ts">
import type { GithubProfile } from '../interfaces/types'

defineProps<{ profile: GithubProfile | null; loading: boolean }>()

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
</script>

<template>
  <div class="profile-header">
    <template v-if="loading">
      <AppSkeleton width="64px" height="64px" :rounded="true" />
      <div class="profile-header__info">
        <AppSkeleton width="180px" height="20px" />
        <AppSkeleton width="120px" height="14px" style="margin-top: 6px" />
        <AppSkeleton width="240px" height="12px" style="margin-top: 8px" />
      </div>
      <AppSkeleton width="80px" height="64px" />
    </template>

    <template v-else-if="profile">
      <img :src="profile.avatarUrl" :alt="profile.login" class="profile-header__avatar" />
      <div class="profile-header__info">
        <h1 class="profile-header__name">{{ profile.name ?? profile.login }}</h1>
        <p class="profile-header__login">
          <a :href="profile.url" target="_blank" rel="noopener">{{ profile.login }}</a>
        </p>
        <p v-if="profile.bio" class="profile-header__bio">{{ profile.bio }}</p>
        <div class="profile-header__stats">
          <span>{{ formatNumber(profile.publicRepos) }} repos</span>
          <span>{{ formatNumber(profile.followers) }} followers</span>
          <span>{{ formatNumber(profile.following) }} following</span>
        </div>
      </div>
      <div class="profile-header__score-badge">
        <div class="score-badge__number">{{ profile.score.total }}</div>
        <div class="score-badge__label">GitHub Score</div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-header {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.profile-header__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  flex-shrink: 0;
}
.profile-header__info { flex: 1; min-width: 0; }
.profile-header__name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.profile-header__login a {
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
}
.profile-header__login a:hover { color: #111827; }
.profile-header__bio {
  font-size: 0.875rem;
  color: #374151;
  margin: 4px 0 0;
}
.profile-header__stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.8125rem;
  color: #374151;
}
.profile-header__score-badge {
  text-align: center;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 10px 16px;
  flex-shrink: 0;
}
.score-badge__number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #166534;
}
.score-badge__label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
</style>
