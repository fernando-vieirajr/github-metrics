import type { ScoreBreakdown } from '../../interfaces/types'

export function calculateScore(
  commitsThisYear: number,
  streakDays: number,
  activeDays: number,
  totalStars: number,
  totalForks: number,
  totalWatchers: number,
  pullRequestsMerged: number,
  issuesClosed: number,
  codeReviews: number,
  languageCount: number,
  hasCommits: boolean,
  hasPRs: boolean,
  hasIssues: boolean,
  hasReviews: boolean,
): ScoreBreakdown {
  const activityRaw =
    (commitsThisYear / 500) * 175 +
    (streakDays / 60) * 100 +
    (activeDays / 200) * 75
  const activity = Math.round(Math.min(activityRaw, 350))

  const starsScore = totalStars > 0 ? (Math.log10(totalStars) / 4) * 200 : 0
  const forksScore = totalForks > 0 ? (Math.log10(totalForks) / 3) * 100 : 0
  const watchersScore = totalWatchers > 0 ? (Math.log10(totalWatchers) / 3) * 50 : 0
  const impactRaw = starsScore + forksScore + watchersScore
  const impact = Math.round(Math.min(impactRaw, 350))

  const boolCount = [hasCommits, hasPRs, hasIssues, hasReviews].filter(Boolean).length
  const diversityRaw = (languageCount / 10) * 100 + (boolCount / 4) * 100
  const diversity = Math.round(Math.min(diversityRaw, 200))

  const engagementRaw =
    (pullRequestsMerged / 50) * 50 +
    (issuesClosed / 50) * 30 +
    (codeReviews / 30) * 20
  const engagement = Math.round(Math.min(engagementRaw, 100))

  const total = activity + impact + diversity + engagement

  return { total, activity, impact, diversity, engagement }
}
