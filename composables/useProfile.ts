import type { GithubProfile } from '../interfaces/types'

export function useProfile(username: string) {
  const { data, status, error } = useFetch<GithubProfile>(
    `/api/profile/${username}`,
    { key: `profile-${username}` },
  )

  const isLoading = computed(() => status.value === 'pending')
  const isRateLimited = computed(() => (error.value as { statusCode?: number } | null)?.statusCode === 429)

  return { profile: data, isLoading, isRateLimited, error }
}
