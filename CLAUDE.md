# FlashTap

FlashTap é um jogo web de memória e reflexo (Next.js + React + TypeScript): o jogador memoriza uma sequência de botões iluminados, reproduz na ordem correta no menor tempo possível, e compete contra seu próprio recorde local.

## Documentos-fonte

Toda decisão de produto, regra de jogo e arquitetura já está documentada — consulte antes de assumir escopo:

- [`docs/product/prd.md`](docs/product/prd.md) — PRD v2.2: visão de produto, objetivos, público-alvo, requisitos funcionais (RF).
- [`docs/product/backlog.md`](docs/product/backlog.md) — Backlog Refinado: 29 histórias (US-00a a US-24) organizadas em features F0–F9, cada uma com Critérios de Aceite, Refinamento Técnico (camada/tarefas/dependências/riscos) e pontuação APF. **Ponto de partida para qualquer implementação de feature.**
- [`docs/game-design/grs.md`](docs/game-design/grs.md) — GRS v1.2: máquina de estados do jogo, regras de sorteio/exibição/validação, fórmulas de tempo e distância.
- [`docs/architecture/README.md`](docs/architecture/README.md) — Índice de ADRs v1.4 (decisões técnicas aprovadas para o MVP) e estrutura de pastas resultante. ADRs individuais em [`docs/architecture/adr/`](docs/architecture/adr/).
- [`docs/design/ui-mockup.html`](docs/design/ui-mockup.html) — Mockup de UI.

## Convenções obrigatórias (ver ADRs para detalhes)

- **Clean Architecture**: `src/domain` (regras puras do jogo, sem React/I/O) → `src/application` (hooks que conectam domain à UI) → `src/infrastructure` (LocalStorage, Sentry — única camada com I/O real) → `src/presentation` (`app/` containers, `components/` presentational, `theme/`, `error-boundary/`). Import boundaries entre camadas são enforced via `eslint-plugin-boundaries` (ADR-005) — não violar.
- **TypeScript** `strict: true`, zero `any` em qualquer camada (`@typescript-eslint/no-explicit-any: error`).
- **pnpm** como gerenciador de pacotes; `pnpm-lock.yaml` sempre commitado.
- **Padrão Container/Presentational** (ADR-009): componentes em `presentation/components` são puros (só props); hooks de `application` só são chamados por containers em `presentation/app`.
- **Pirâmide de testes**: Vitest (unitário em `domain`), Vitest + React Testing Library (componente em `presentation`), StrykerJS restrito a `domain` (mutation testing, meta inicial 80%, ADR-003), Playwright com perfil mobile como padrão (ADR-004).
- **Dados persistidos**: sempre via Zod schema + chave versionada (`flashtap:v1:*`, ADR-008) — dado inválido nunca deve lançar exceção não tratada, deve degradar graciosamente.
- **Theming**: Ant Design `ConfigProvider` com os algoritmos claro/escuro, detectando `prefers-color-scheme` (ADR-012).

## Status atual

Sprints 0 a 4 concluídos e mesclados: F0 (Setup), F1 (Home), F2 (Onboarding), F3 (Motor de Jogo, US-05–09) e F4 (Progressão, US-10–12). A estrutura `src/domain|application|infrastructure|presentation` já está populada, com tooling completo (ESLint/Prettier, Vitest, Stryker, Playwright). Em andamento/pendentes: F5 (Timer, US-13), F6 (Resultado, US-14–16), F7 (Persistência Local, US-17–20) e F9 (Enablers Técnicos, US-21–24).

## Como trabalhar uma história

Cada história em `docs/product/backlog.md` já vem com Critérios de Aceite (rastreados a RF do PRD / seções do GRS) e Refinamento Técnico (camada, tarefas, dependências, riscos) — use isso diretamente ao implementar em vez de redescobrir escopo. Respeite a ordem de dependências indicada em cada história (ex.: US-01 depende de US-17 para o recorde real).
