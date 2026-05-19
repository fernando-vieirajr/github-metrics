export interface Language {
  name: string
  color: string
  percentage: number
}

export interface Repo {
  name: string
  url: string
  description: string
  stargazerCount: number
  forkCount: number
  watcherCount: number
  primaryLanguage: Language | null
  isPrivate: boolean
}

export interface ContribMonth {
  month: string
  count: number
}

export interface ScoreBreakdown {
  total: number
  activity: number
  impact: number
  diversity: number
  engagement: number
}

export interface GithubProfile {
  login: string
  name: string
  bio: string
  avatarUrl: string
  url: string
  followers: number
  following: number
  publicRepos: number
  totalStars: number
  totalForks: number
  totalWatchers: number
  commitsThisYear: number
  pullRequestsMerged: number
  issuesClosed: number
  codeReviews: number
  streakDays: number
  activeDays: number
  languages: Language[]
  topRepos: Repo[]
  contribByMonth: ContribMonth[]
  score: ScoreBreakdown
  isPartial: boolean
}

export interface ApiError {
  statusCode: number
  message: string
  retryAfter?: number
}
