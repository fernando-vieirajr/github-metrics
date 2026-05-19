import type { GithubProfile, Language, Repo, ContribMonth } from '../../shared/types'
import { calculateScore } from './score'

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const USER_PROFILE_QUERY = `
  query UserProfile($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      login
      name
      bio
      avatarUrl
      url
      followers { totalCount }
      following { totalCount }
      repositories(first: 100, orderBy: { field: STARGAZERS, direction: DESC }, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          url
          description
          stargazerCount
          forkCount
          isPrivate
          watchers { totalCount }
          primaryLanguage { name color }
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges { size node { name color } }
          }
        }
      }
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays { contributionCount date }
          }
        }
      }
    }
  }
`

async function graphql(query: string, variables: Record<string, unknown>, token?: string): Promise<{ data: unknown; errors?: unknown[] }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'github-metrics/1.0',
  }
  if (token) {
    headers['Authorization'] = `bearer ${token}`
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    const body = await response.json() as { message?: string }
    throw new Error(body.message ?? `GitHub API error: ${response.status}`)
  }

  return response.json() as Promise<{ data: unknown; errors?: unknown[] }>
}

function computeLanguages(repos: Array<{ languages: { edges: Array<{ size: number; node: { name: string; color: string } }> } }>): Language[] {
  const totals = new Map<string, { size: number; color: string }>()

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name)
      totals.set(edge.node.name, {
        size: (existing?.size ?? 0) + edge.size,
        color: edge.node.color,
      })
    }
  }

  const totalSize = Array.from(totals.values()).reduce((sum, l) => sum + l.size, 0)
  if (totalSize === 0) return []

  return Array.from(totals.entries())
    .map(([name, { size, color }]) => ({
      name,
      color,
      percentage: Math.round((size / totalSize) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10)
}

function computeStreak(weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>): { streak: number; activeDays: number } {
  const days = weeks.flatMap(w => w.contributionDays).reverse()
  let streak = 0

  for (const day of days) {
    if (day.contributionCount > 0) {
      streak++
    } else if (streak > 0) {
      break
    }
  }

  const totalActive = days.filter(d => d.contributionCount > 0).length
  return { streak, activeDays: totalActive }
}

function computeContribByMonth(weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>): ContribMonth[] {
  const byMonth = new Map<string, number>()

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      const month = day.date.slice(0, 7)
      byMonth.set(month, (byMonth.get(month) ?? 0) + day.contributionCount)
    }
  }

  return Array.from(byMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12)
}

type RawUser = {
  login: string
  name: string | null
  bio: string | null
  avatarUrl: string
  url: string
  followers: { totalCount: number }
  following: { totalCount: number }
  repositories: {
    totalCount: number
    nodes: Array<{
      name: string
      url: string
      description: string | null
      stargazerCount: number
      forkCount: number
      isPrivate: boolean
      watchers: { totalCount: number }
      primaryLanguage: { name: string; color: string } | null
      languages: { edges: Array<{ size: number; node: { name: string; color: string } }> }
    }>
  }
  contributionsCollection: {
    totalCommitContributions: number
    totalPullRequestContributions: number
    totalIssueContributions: number
    totalPullRequestReviewContributions: number
    contributionCalendar: {
      totalContributions: number
      weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>
    }
  }
}

export async function fetchGithubProfile(username: string, token: string | undefined): Promise<GithubProfile> {
  const now = new Date()
  const yearAgo = new Date(now)
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  const result = await graphql(USER_PROFILE_QUERY, {
    username,
    from: yearAgo.toISOString(),
    to: now.toISOString(),
  }, token) as { data: { user: RawUser | null } }

  const u = result.data?.user
  if (!u) {
    throw new Error(`User "${username}" not found`)
  }

  const repos: Repo[] = u.repositories.nodes
    .filter(r => !r.isPrivate)
    .map(r => ({
      name: r.name,
      url: r.url,
      description: r.description,
      stargazerCount: r.stargazerCount,
      forkCount: r.forkCount,
      watcherCount: r.watchers.totalCount,
      primaryLanguage: r.primaryLanguage,
      isPrivate: r.isPrivate,
    }))

  const languages = computeLanguages(u.repositories.nodes)
  const cc = u.contributionsCollection
  const { streak, activeDays } = computeStreak(cc.contributionCalendar.weeks)
  const contribByMonth = computeContribByMonth(cc.contributionCalendar.weeks)

  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forkCount, 0)
  const totalWatchers = repos.reduce((sum, r) => sum + r.watcherCount, 0)

  const score = calculateScore(
    cc.totalCommitContributions,
    streak,
    activeDays,
    totalStars,
    totalForks,
    totalWatchers,
    cc.totalPullRequestContributions,
    cc.totalIssueContributions,
    cc.totalPullRequestReviewContributions,
    languages.length,
    cc.totalCommitContributions > 0,
    cc.totalPullRequestContributions > 0,
    cc.totalIssueContributions > 0,
    cc.totalPullRequestReviewContributions > 0,
  )

  return {
    login: u.login,
    name: u.name,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    url: u.url,
    followers: u.followers.totalCount,
    following: u.following.totalCount,
    publicRepos: u.repositories.totalCount,
    totalStars,
    totalForks,
    totalWatchers,
    commitsThisYear: cc.totalCommitContributions,
    pullRequestsMerged: cc.totalPullRequestContributions,
    issuesClosed: cc.totalIssueContributions,
    codeReviews: cc.totalPullRequestReviewContributions,
    streakDays: streak,
    activeDays,
    languages,
    topRepos: repos.slice(0, 20),
    contribByMonth,
    score,
    isPartial: false,
  }
}
