<script setup lang="ts">
import './[username].css'
const route = useRoute()
const username = route.params.username as string
const { profile, isLoading, isRateLimited, error } = useProfile(username)

const activeTab = ref('Top Repos')
const tabs = ['Top Repos', 'Activity', 'Languages', 'Score']

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

const retryAfter = computed(() => (error.value as { data?: { retryAfter?: number } } | null)?.data?.retryAfter ?? 60)
</script>

<template>
  <div class="dashboard">
    <nav class="dashboard__nav">
      <span class="dashboard__nav-brand">Métricas GitHub</span>
      <a href="https://github.com/fernando-vieirajr" target="_blank" rel="noopener" class="dashboard__nav-github">
        GitHub ↗
      </a>
    </nav>

    <main class="dashboard__main">
      <div v-if="isRateLimited" class="dashboard__error">
        <h2>Rate limit reached</h2>
        <p>GitHub API rate limit hit. Try again in {{ retryAfter }} seconds.</p>
      </div>

      <template v-else>
        <ProfileHeader :profile="profile ?? null" :loading="isLoading" class="dashboard__section" />

        <div class="dashboard__stats">
          <div class="stat-card">
            <template v-if="isLoading">
              <AppSkeleton height="24px" width="60px" />
              <AppSkeleton height="14px" width="80px" style="margin-top: 4px" />
            </template>
            <template v-else-if="profile">
              <div class="stat-card__value">{{ formatNumber(profile.totalStars) }}</div>
              <div class="stat-card__label">Total Stars</div>
            </template>
          </div>
          <div class="stat-card">
            <template v-if="isLoading">
              <AppSkeleton height="24px" width="60px" />
              <AppSkeleton height="14px" width="80px" style="margin-top: 4px" />
            </template>
            <template v-else-if="profile">
              <div class="stat-card__value">{{ formatNumber(profile.commitsThisYear) }}</div>
              <div class="stat-card__label">Commits / Year</div>
            </template>
          </div>
          <div class="stat-card">
            <template v-if="isLoading">
              <AppSkeleton height="24px" width="60px" />
              <AppSkeleton height="14px" width="80px" style="margin-top: 4px" />
            </template>
            <template v-else-if="profile">
              <div class="stat-card__value">🔥 {{ profile.streakDays }}</div>
              <div class="stat-card__label">Streak Days</div>
            </template>
          </div>
          <div class="stat-card">
            <template v-if="isLoading">
              <AppSkeleton height="24px" width="60px" />
              <AppSkeleton height="14px" width="80px" style="margin-top: 4px" />
            </template>
            <template v-else-if="profile">
              <div class="stat-card__value">{{ profile.languages.length }}</div>
              <div class="stat-card__label">Languages</div>
            </template>
          </div>
        </div>

        <ContribChart
          :data="profile?.contribByMonth ?? null"
          :loading="isLoading"
          class="dashboard__section"
        />

        <div class="dashboard__tabs-section">
          <TabNav v-model="activeTab" :tabs="tabs" />

          <div v-if="activeTab === 'Top Repos'">
            <RepoList :repos="profile?.topRepos ?? null" :loading="isLoading" />
          </div>
          <div v-else-if="activeTab === 'Activity'">
            <ActivityTimeline :profile="profile ?? null" :loading="isLoading" />
          </div>
          <div v-else-if="activeTab === 'Languages'">
            <LanguageBar :languages="profile?.languages ?? null" :loading="isLoading" />
          </div>
          <div v-else-if="activeTab === 'Score'">
            <ScoreCard :score="profile?.score ?? null" :loading="isLoading" />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>
