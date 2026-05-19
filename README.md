# Métricas GitHub

Dashboard pessoal que exibe métricas do meu perfil no GitHub: score composto, linguagens, contribuições, repositórios e atividade.

🔗 **https://github-metrics.pages.dev**

## O que exibe

- **Score 0–1000** — pontuação composta baseada em atividade, impacto, diversidade e engajamento
- **Contribuições** — gráfico mensal dos últimos 12 meses
- **Repositórios** — top repos ordenados por estrelas
- **Linguagens** — barra proporcional entre todos os repositórios
- **Atividade** — commits no ano, streak, PRs, issues e code reviews

## Stack

- [Nuxt 3](https://nuxt.com) + [Nitro](https://nitro.unjs.io) — full-stack, compila para Cloudflare Workers
- [Vue 3](https://vuejs.org) + TypeScript
- [Chart.js](https://www.chartjs.org) — gráfico de contribuições
- [Cloudflare Pages](https://pages.cloudflare.com) + [KV](https://developers.cloudflare.com/kv/) — hosting e cache
- [GitHub GraphQL API v4](https://docs.github.com/en/graphql)
