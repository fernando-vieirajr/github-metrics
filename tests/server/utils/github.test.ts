import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGithubProfile } from '../../../server/utils/github'

const mockApiResponse = {
  data: {
    user: {
      login: 'testuser',
      name: 'Test User',
      bio: 'A developer',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1',
      url: 'https://github.com/testuser',
      followers: { totalCount: 100 },
      following: { totalCount: 50 },
      repositories: {
        nodes: [
          {
            name: 'my-repo',
            url: 'https://github.com/testuser/my-repo',
            description: 'A repo',
            stargazerCount: 42,
            forkCount: 10,
            watchers: { totalCount: 5 },
            isPrivate: false,
            primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
            languages: {
              edges: [
                { size: 10000, node: { name: 'TypeScript', color: '#3178c6' } },
              ],
            },
          },
        ],
        totalCount: 1,
      },
      contributionsCollection: {
        totalCommitContributions: 200,
        totalPullRequestContributions: 15,
        totalIssueContributions: 8,
        totalPullRequestReviewContributions: 5,
        contributionCalendar: {
          totalContributions: 228,
          weeks: [],
        },
      },
      pinnedItems: { nodes: [] },
    },
  },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockApiResponse),
    headers: new Headers({ 'x-ratelimit-remaining': '100' }),
  }))
})

describe('fetchGithubProfile', () => {
  it('returns a GithubProfile with correct login', async () => {
    const profile = await fetchGithubProfile('testuser', undefined)
    expect(profile.login).toBe('testuser')
  })

  it('maps totalCommitContributions to commitsThisYear', async () => {
    const profile = await fetchGithubProfile('testuser', undefined)
    expect(profile.commitsThisYear).toBe(200)
  })

  it('includes a score in the response', async () => {
    const profile = await fetchGithubProfile('testuser', undefined)
    expect(profile.score.total).toBeGreaterThanOrEqual(0)
    expect(profile.score.total).toBeLessThanOrEqual(1000)
  })

  it('throws on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ message: 'Bad credentials' }),
    }))
    await expect(fetchGithubProfile('testuser', 'bad-token')).rejects.toThrow()
  })
})
