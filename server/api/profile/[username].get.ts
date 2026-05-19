import { fetchGithubProfile } from '../../utils/github'
import { getCached, setCached } from '../../utils/cache'
import type { GithubProfile } from '#core/interfaces/types'
import { CACHE_TTL_SECONDS } from '#core/constants'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')

  if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    throw createError({ statusCode: 400, message: 'Invalid username' })
  }

  const cacheKey = `profile:${username.toLowerCase()}`

  const cached = await getCached<GithubProfile>(cacheKey)
  if (cached) {
    setHeader(event, 'X-Cache', 'HIT')
    return cached
  }

  const { githubToken } = useRuntimeConfig()
  const profile = await fetchGithubProfile(username, githubToken || undefined)

  await setCached(cacheKey, profile, CACHE_TTL_SECONDS)
  setHeader(event, 'X-Cache', 'MISS')

  return profile
})
