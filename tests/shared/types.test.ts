import { describe, it, expect } from 'vitest'
import type { ScoreBreakdown, GithubProfile } from '../../shared/types'

describe('ScoreBreakdown', () => {
  it('total equals sum of parts', () => {
    const score: ScoreBreakdown = {
      activity: 175,
      impact: 120,
      diversity: 80,
      engagement: 45,
      total: 175 + 120 + 80 + 45,
    }

    expect(score.total).toBe(score.activity + score.impact + score.diversity + score.engagement)
  })
})

describe('GithubProfile', () => {
  it('has correct login field', () => {
    const profile: GithubProfile = {
      login: 'octocat',
      name: 'The Octocat',
      bio: 'A test profile',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1',
      url: 'https://github.com/octocat',
      followers: 100,
      following: 50,
      publicRepos: 30,
      totalStars: 500,
      totalForks: 200,
      totalWatchers: 150,
      commitsThisYear: 365,
      pullRequestsMerged: 40,
      issuesClosed: 20,
      codeReviews: 15,
      streakDays: 30,
      activeDays: 100,
      languages: [],
      topRepos: [],
      contribByMonth: [],
      score: { total: 0, activity: 0, impact: 0, diversity: 0, engagement: 0 },
      isPartial: false,
    }

    expect(profile.login).toBe('octocat')
  })
})
