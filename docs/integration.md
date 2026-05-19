# GitHub API Integration

## Overview

github-metrics integrates with the GitHub GraphQL API v4 to fetch profile data, repository statistics, and contribution history.

## Authentication

Two modes are supported:

**Public mode:** No authentication required. Uses GitHub's unauthenticated rate limit (60 requests/hour per IP). Fetches only public data.

**Authenticated mode:** User authenticates via GitHub OAuth App. Grants `read:user` and `repo` scopes. Rate limit increases to 5,000 requests/hour per user. Unlocks private repositories and detailed contribution data.

## OAuth Flow

1. User clicks "Login with GitHub"
2. Redirected to `https://github.com/login/oauth/authorize?client_id=...&scope=read:user repo`
3. User authorizes the app on GitHub
4. GitHub redirects to `/auth/callback?code=...`
5. Frontend sends `code` to `POST /api/auth/exchange`
6. Server exchanges code for `access_token` using `client_secret` (never exposed to browser)
7. Token stored in `httpOnly` cookie; all subsequent API calls are authenticated

## GraphQL Query

The primary query fetches:
- User profile: name, bio, avatar, follower/following counts
- Repositories: top 100 by stars, with language breakdown
- `contributionsCollection`: commits, PRs, issues, and code reviews for the past 12 months
- Contribution calendar: daily counts for streak and activity calculations

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/profile/:username` | Public profile data + composite score |
| GET | `/api/profile/me` | Authenticated user's profile |
| POST | `/api/auth/exchange` | Exchange OAuth code for token |

## Rate Limits

- Unauthenticated: 60 requests/hour (GitHub REST), limited GraphQL access
- Authenticated: 5,000 requests/hour per user token
- Responses are cached in Cloudflare KV for 1 hour per username to minimize API calls

## Scopes Requested

| Scope | Purpose |
|---|---|
| `read:user` | Access public and private user profile data |
| `repo` | Access private repository data and contribution stats |

## Support

Open an issue at https://github.com/fieldcontrol/github-metrics/issues
