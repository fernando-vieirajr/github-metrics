<script setup lang="ts">
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

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.dashboard__nav {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dashboard__nav-brand {
  font-weight: 800;
  font-size: 1rem;
  color: #111827;
}
.dashboard__nav-github {
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
}
.dashboard__nav-github:hover { color: #111827; }
.dashboard__main {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
}
.dashboard__section {
  margin-bottom: 16px;
}
.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}
.stat-card__value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.stat-card__label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 4px;
}
.dashboard__tabs-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
}
.dashboard__error {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 32px;
  text-align: center;
  color: #374151;
}
.dashboard__error h2 { margin: 0 0 8px; color: #111827; }
</style>
