# github-metrics — Design Spec

**Data:** 2026-05-18  
**Objetivo:** Dashboard público de métricas do GitHub para obtenção do badge GitHub Developer Program Member.

---

## Contexto

Projeto de portfólio técnico que consome a GitHub GraphQL API de forma real e segura. Deve ser público, deployado, documentado e suficiente para atender os critérios do GitHub Developer Program.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Vite + Vue 3 + TypeScript + Vue Router |
| Gráficos | Chart.js |
| Backend | Cloudflare Workers |
| Cache | Cloudflare KV (TTL 1h por username) |
| Deploy frontend | GitHub Pages |
| Auth | GitHub OAuth App |
| API | GitHub GraphQL API v4 |

---

## Arquitetura

```
Usuário
  ↕
Vite + Vue 3 SPA (GitHub Pages)
  ↕
Cloudflare Worker  ←→  Cloudflare KV (cache)
  ↕
GitHub GraphQL API v4
```

**Modo público:** usuário digita qualquer username → SPA chama Worker → Worker consulta GitHub API → calcula score → retorna dados (cacheados 1h) → SPA renderiza dashboard.

**Modo autenticado:** usuário clica "Login with GitHub" → redirect para GitHub OAuth → callback na SPA → SPA envia `code` para Worker → Worker troca por `access_token` (client secret armazenado no Cloudflare, nunca exposto) → token armazenado em `sessionStorage` → chamadas subsequentes incluem token no header para dados privados.

---

## Telas

### Landing (`/`)
- Input de username com botão "Explore →"
- Botão "Login with GitHub" (OAuth)
- Texto explicativo: login desbloqueia repos privados e dados detalhados de contribuição

### Dashboard (`/u/:username`)
- `ProfileHeader` — avatar, nome, bio, stats (repos, followers, following), GitHub Score badge
- 4 stat cards — total stars, commits/ano, streak em dias, nº de linguagens
- `LanguageBar` — barra proporcional de linguagens com legenda
- `ScoreCard` — score 0–1000 com breakdown por dimensão
- `ContribChart` — gráfico de barras dos últimos 12 meses (contribuições por mês)
- `TabNav` com abas:
  - **Top Repos** — lista com stars, forks, watchers, linguagem primária
  - **PRs Merged** — histórico de PRs com repo, título, data
  - **Issues** — issues abertas/fechadas por repo
  - **Comparativo** — evolução de linguagens e commits ao longo dos anos

### Auth Callback (`/auth/callback`)
- Recebe `?code=` do GitHub
- Chama Worker para troca por token
- Redireciona para `/u/me` em caso de sucesso ou Landing em caso de erro

---

## Componentes Vue

```
src/
├── pages/
│   ├── Landing.vue
│   ├── Dashboard.vue
│   └── AuthCallback.vue
├── components/
│   ├── ProfileHeader.vue
│   ├── ScoreCard.vue
│   ├── LanguageBar.vue
│   ├── ContribChart.vue
│   ├── RepoList.vue
│   ├── ActivityTimeline.vue
│   └── TabNav.vue
├── composables/
│   ├── useProfile.ts        # busca dados do Worker, gerencia loading/error
│   └── useAuth.ts           # estado OAuth com ref + sessionStorage
└── lib/
    ├── api.ts               # funções de chamada ao Worker
    └── score.ts             # tipos TypeScript do score
```

---

## Worker — Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/profile/:username` | Dados públicos + score. Cache KV por 1h. |
| `POST` | `/api/auth/exchange` | Troca OAuth `code` por `access_token`. |
| `GET` | `/api/profile/me` | Dados do usuário autenticado (Bearer token no header). |

O Worker nunca expõe o `client_secret` da OAuth App — ele fica em variável de ambiente do Cloudflare.

---

## GitHub Score Composto (0–1000)

| Dimensão | Peso | Métricas |
|---|---|---|
| **Atividade** | 350 pts | commits/ano, streak, dias ativos nos últimos 12 meses |
| **Impacto** | 350 pts | total de stars, forks, watchers, nº de contribuidores nos repos |
| **Diversidade** | 200 pts | nº de linguagens usadas, variedade de tipos de contribuição (code, docs, issues) |
| **Engajamento** | 100 pts | PRs merged, issues fechadas, code reviews feitos |

Score calculado no Worker a partir dos dados da GraphQL API. Retornado como objeto com total e breakdown por dimensão.

---

## Dados da GitHub GraphQL API

```graphql
# Queries principais
user(login: $username) {
  name, bio, avatarUrl, url
  repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}) {
    nodes { name, stargazerCount, forkCount, watchers, primaryLanguage, ... }
  }
  contributionsCollection(from: $yearAgo, to: $now) {
    totalCommitContributions
    totalPullRequestContributions
    totalIssueContributions
    totalPullRequestReviewContributions
    contributionCalendar { totalContributions, weeks { contributionDays { ... } } }
  }
  pinnedItems(first: 6) { ... }
  followers { totalCount }
  following { totalCount }
}
```

---

## Tratamento de Erros

| Situação | Comportamento |
|---|---|
| Username não encontrado (404) | Mensagem amigável na SPA: "Usuário não encontrado" |
| Rate limit atingido (429) | Worker retorna `retry_after` → SPA exibe countdown |
| OAuth code expirado | Redirect para Landing com `?error=oauth_failed` |
| API lenta | Skeleton loading por componente (não spinner de página inteira) |
| Dados públicos insuficientes | Score parcial com aviso "dados limitados" |

---

## Estilo Visual

- **Tema:** Clean / Minimal Light
- **Fundo:** `#fafafa`, cards `#fff` com `border: 1px solid #e5e7eb`
- **Tipografia:** sem-serif do sistema, hierarquia clara
- **Cor de destaque:** verde para score/contribuições, azul para links e ações
- **Score badge:** destaque visual no header do perfil, fundo `#f0fdf4`, texto `#166534`

---

## Deploy e Infraestrutura

- **GitHub Pages:** deploy automático via GitHub Actions ao fazer push em `main`
- **Cloudflare Workers:** deploy via Wrangler CLI, secrets configurados no dashboard Cloudflare
- **GitHub OAuth App:** callback URL apontando para o domínio do GitHub Pages
- **Domínio:** `<usuario>.github.io/github-metrics` (ou domínio custom via CNAME)

---

## Documentação (requisito do Developer Program)

- `README.md` — descrição, screenshots, como rodar localmente, como contribuir
- `docs/integration.md` — documentação da integração com GitHub API (endpoints usados, escopos OAuth, rate limits)
- Página de suporte: link para GitHub Issues no README

---

## Definition of Done

- [ ] Aplicação online e acessível publicamente
- [ ] Uso real da GitHub GraphQL API (modo público + OAuth)
- [ ] README completo com screenshots
- [ ] `docs/integration.md` com documentação da integração
- [ ] Repositório público no GitHub
- [ ] Link de suporte/contato (GitHub Issues)
- [ ] Aplicação enviada ao GitHub Developer Program
