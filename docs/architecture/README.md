# Arquitetura — FlashTap

> Produto: FlashTap
> Versão: 1.4
> Status: Aprovado para MVP

---

## Como ler este documento

Cada ADR (Architecture Decision Record) documenta uma decisão técnica isolada: o contexto que levou a ela, a decisão tomada e as consequências (trade-offs aceitos). Decisões aqui registradas só devem ser revertidas por meio de um novo ADR que a substitua, nunca silenciosamente no código.

## Architecture Decision Records

- [ADR-001 — Gerenciamento de estado do jogo com hooks nativos do React](adr/0001-gerenciamento-de-estado-do-jogo-com-hooks-nativos-do-react.md)
- [ADR-002 — Test runner: Vitest + React Testing Library](adr/0002-test-runner-vitest-react-testing-library.md)
- [ADR-003 — Mutation testing: StrykerJS](adr/0003-mutation-testing-strykerjs.md)
- [ADR-004 — E2E automatizado: Playwright](adr/0004-e2e-automatizado-playwright.md)
- [ADR-005 — Gerenciador de pacotes e enforcement de Clean Architecture: pnpm + eslint-plugin-boundaries](adr/0005-gerenciador-de-pacotes-e-enforcement-de-clean-architecture.md)
- [ADR-006 — Hospedagem e Deploy: Next.js Static Export no GitHub Pages](adr/0006-hospedagem-e-deploy-nextjs-static-export-github-pages.md)
- [ADR-007 — Observabilidade: Error Boundary + Sentry (client-side)](adr/0007-observabilidade-error-boundary-sentry.md)
- [ADR-008 — Contrato e versionamento de dados no LocalStorage](adr/0008-contrato-e-versionamento-de-dados-no-localstorage.md)
- [ADR-009 — Padrão de componentes: Container/Presentational](adr/0009-padrao-de-componentes-container-presentational.md)
- [ADR-010 — Node, dependências e segurança da cadeia de suprimentos](adr/0010-node-dependencias-e-seguranca-da-cadeia-de-suprimentos.md)
- [ADR-011 — Observação de uso e comportamento: Microsoft Clarity](adr/0011-observacao-de-uso-e-comportamento-microsoft-clarity.md)
- [ADR-012 — Theming: Ant Design ConfigProvider com detecção de `prefers-color-scheme`](adr/0012-theming-ant-design-configprovider.md)

---

## Estrutura de Pastas Resultante

```
src/
  domain/              → Game Engine puro: reducer, regras do GRS, cálculo de distância,
                          fórmula de tempo de exibição, geração de sorteio.
                          Sem React, sem Ant Design, sem I/O.

  application/         → Hooks que conectam domain à UI (useGameEngine, useLocalRecord).
                          Único ponto de acesso do domain para a presentation.

  infrastructure/       → Adapter de LocalStorage (leitura/escrita + validação Zod + versionamento
                          de chave), inicialização do Sentry. Única camada com I/O real do MVP.

  presentation/
    app/                → Rotas Next.js App Router (Home, Jogo, Resultado) — containers,
                          únicos que chamam hooks de application.
    components/         → Componentes Ant Design puros/presentational (Board, GameButton, Timer,
                          ReadyCountdown, ResultSummary) — só props, sem hooks de domínio.
    theme/              → Design tokens (paleta do GRS seção 8, variantes claro/escuro) via
                          ConfigProvider do Ant Design; detecção de prefers-color-scheme.
    error-boundary/      → Error Boundary global + fallback de UI.
    analytics/           → Consentimento de cookies (LGPD) + carregamento condicional
                          do script do Microsoft Clarity.

src/instrumentation-client.ts → Inicialização condicional do Sentry (client-side).

.nvmrc                  → Versão de Node fixada
pnpm-lock.yaml           → Commitado, builds reprodutíveis
```

---

## Stack de Qualidade — Resumo

| Camada | Ferramenta |
|---|---|
| Gerenciador de pacotes | pnpm |
| Lint | ESLint (`@typescript-eslint/no-explicit-any: error`, `eslint-plugin-boundaries`, `eslint-plugin-jsx-a11y`) |
| Format | Prettier (via `eslint-config-prettier`) |
| TypeScript | `strict: true`, zero `any` em qualquer camada |
| Estado do jogo | Hooks nativos do React (`useReducer` no domain, hook customizado na application) |
| Teste unitário (domain) | Vitest |
| Teste de componente (presentation) | Vitest + React Testing Library |
| Teste de mutação | StrykerJS, focado em `domain`, meta inicial de 80% |
| Teste E2E | Playwright, perfil mobile como padrão |
| Deploy/Hospedagem | Next.js static export, GitHub Pages via GitHub Actions (sem preview por PR) |
| Observação de uso/comportamento | Microsoft Clarity (heatmap + gravação de sessão, gratuito e sem cap) |
| Observabilidade | React Error Boundary + Sentry (free tier) |
| Validação de dados persistidos | Zod, chaves versionadas (`flashtap:v1:record`, `:preferences`, `:tutorial-seen`) |
| Theming claro/escuro | Ant Design ConfigProvider (`defaultAlgorithm`/`darkAlgorithm`) + `prefers-color-scheme` |
| Padrão de componente | Container/Presentational |
| Node/dependências | `.nvmrc` + `engines`, pnpm-lock commitado, Dependabot, `pnpm audit` em CI |
| CI | GitHub Actions: lint → typecheck → unit+component → mutation (PRs em `domain/`) → E2E → deploy |

---

## Riscos e Decisões que Seguem em Aberto (fora da alçada técnica)

- **Orçamento de Sentry**: free tier assumido para o MVP; se o volume de erros/usuários crescer, é decisão de negócio aprovar plano pago.
- **Domínio próprio**: não foi definido se o produto terá domínio customizado (custo/registro via `CNAME`) ou ficará no domínio padrão do GitHub Pages (`<owner>.github.io/FlashTap`) — decisão de PO/negócio, não técnica.
- **Banner de consentimento de cookies (LGPD)**: necessário por causa do Microsoft Clarity coletar dados comportamentais; conteúdo/texto do banner é decisão de produto, não técnica.
- **Meta de mutation score (80%)**: número inicial definido pelo TL: deve ser revisto com o time após o primeiro ciclo real de execução do Stryker, pode ser ajustado para cima ou para baixo.
