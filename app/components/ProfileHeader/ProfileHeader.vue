<script setup lang="ts">
import './ProfileHeader.css'
import type { GithubProfile } from '#core/interfaces/types'

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
