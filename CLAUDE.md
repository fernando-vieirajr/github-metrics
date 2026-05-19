# github-metrics

Dashboard pessoal de métricas GitHub. Consome a GitHub GraphQL API, processa os dados no servidor e exibe em uma SPA com Nuxt 3. Deploy no Cloudflare Pages com cache via KV.

## Stack

- **Nuxt 3** com `srcDir: 'app'`
- **TypeScript** strict
- **Vitest** para testes
- **Cloudflare Pages + KV** para deploy e cache

## Estrutura

```
app/          # frontend (srcDir do Nuxt)
  assets/     # CSS global (colors.css com variáveis)
  components/ # cada componente em sua própria pasta (ComponentName/ComponentName.vue + .css)
  composables/
  pages/

core/         # código compartilhado, sem dependência de Nuxt ou Vue
  constants/  # valores fixos (TTL, URLs, limites)
  interfaces/ # tipos TypeScript

server/       # Nitro/Nuxt server
  api/        # endpoints REST
  utils/      # lógica de negócio (github.ts, score.ts, cache.ts)

tests/        # arquivos .test.ts flat, sem subpastas desnecessárias
```

## Arquitetura

### Onde cada coisa vive

| O quê | Onde |
|---|---|
| Tipos e interfaces | `core/interfaces/types.ts` |
| Constantes globais | `core/constants/index.ts` |
| Chamadas à API GitHub | `server/utils/github.ts` |
| Cálculo de score | `server/utils/score.ts` |
| Cache KV | `server/utils/cache.ts` |
| Estado e fetch no cliente | `app/composables/` |
| Componentes visuais | `app/components/NomeDoComponente/` |
| Estilos do componente | `app/components/NomeDoComponente/NomeDoComponente.css` |

### Imports

Use o alias `#core` para importar de `core/`:

```ts
import type { GithubProfile } from '#core/interfaces/types'
import { CACHE_TTL_SECONDS } from '#core/constants'
```

## Convenções

### Componentes

- Cada componente fica em sua própria pasta: `components/TabNav/TabNav.vue`
- O CSS fica no mesmo diretório: `components/TabNav/TabNav.css`, importado via `import './TabNav.css'` no `<script setup>`
- Não usar `<style>` dentro do `.vue`
- Classes seguem BEM: `.tab-nav`, `.tab-nav__item`, `.tab-nav__item--active`

### CSS

- Cores que se repetem devem usar variáveis de `assets/colors.css`
- Não adicionar novas cores hardcoded sem antes verificar se já existe variável equivalente
- Variáveis disponíveis: `--color-white`, `--color-border`, `--color-text-primary`, `--color-text-body`, `--color-text-secondary`, `--color-text-muted`, `--color-bg-subtle`, `--color-bg-muted`

### Constantes

- Valores mágicos (TTLs, limites, URLs externas) pertencem a `core/constants/index.ts`
- Não deixar números ou strings literais espalhados no código

### Tipos

- Todos os tipos compartilhados entre frontend e backend ficam em `core/interfaces/types.ts`
- Tipos locais a um arquivo podem ser declarados inline com `type`

## Princípios

### Single Responsibility
Cada arquivo tem uma responsabilidade clara. `github.ts` busca e transforma dados da API. `score.ts` só calcula o score. `cache.ts` só lida com armazenamento. Composables só gerenciam estado do cliente. Componentes só renderizam.

### Open/Closed
Novos tipos de métricas ou visualizações devem ser adicionados criando novos componentes/funções, não modificando os existentes para acomodar casos especiais.

### DRY
- Antes de duplicar lógica, verifique se ela pertence a `server/utils/`, `app/composables/` ou `core/constants/`
- Estilos repetidos viram variáveis CSS em `colors.css`
- Tipos repetidos viram interfaces em `core/interfaces/types.ts`

### Separação de camadas
- `core/` não importa nada de Nuxt, Vue ou Nitro — é TypeScript puro
- `server/` não importa de `app/`
- `app/` não faz chamadas diretas à GitHub API — passa sempre pelo `server/`

## O que não fazer

- Não criar subpastas dentro de `tests/` — manter flat
- Não usar `<style>` dentro de arquivos `.vue`
- Não hardcodar cores CSS — usar variáveis de `colors.css`
- Não hardcodar valores mágicos — usar `core/constants/`
- Não importar tipos com caminhos relativos longos (`../../../`) — usar `#core`
- Não colocar lógica de transformação de dados dentro de componentes — isso vai em `server/utils/` ou composables
- Não criar arquivos de constantes locais por feature — centralizar em `core/constants/`
