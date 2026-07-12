# Architecture Decision Records (ADR) — FlashTap

> Produto: FlashTap
> Versão: 1.3
> Status: Aprovado para MVP

---

## Como ler este documento

Cada ADR documenta uma decisão técnica isolada: o contexto que levou a ela, a decisão tomada e as consequências (trade-offs aceitos). Decisões aqui registradas só devem ser revertidas por meio de um novo ADR que a substitua, nunca silenciosamente no código.

---

## ADR-001 — Gerenciamento de estado do jogo com hooks nativos do React

**Status:** Aceito

**Contexto:**
O GRS (seção 20) define uma máquina de estados formal para o ciclo de uma partida (`Idle → Ready → ShowingSequence → WaitingInput → ReadyToSubmit → Validating → RoundCompleted → NextRound/NextLevel → Victory/GameOver`). Era cogitado o uso de uma lib de state machine (ex: XState) para modelar isso com garantias formais de transição.

**Decisão:**
O Game Engine será implementado usando **apenas hooks nativos do React** (`useReducer` para a máquina de estados, `useState`/`useEffect` onde couber), sem bibliotecas externas de state machine. A lógica de transição de estados é modelada como um **reducer puro** (`(state, action) => state`), testável isoladamente sem renderizar nenhum componente React.

**Consequências:**
- ✅ Menor superfície de dependências externas; qualquer dev React consegue ler o código sem aprender uma API nova.
- ✅ O reducer, por ser uma função pura, continua 100% testável fora da UI (mantém a Clean Architecture: `domain` não depende de `presentation`).
- ⚠️ As garantias de "transição impossível" que uma lib como XState oferece por construção não existem aqui — precisam ser garantidas via testes (unitário + mutação) cobrindo os Invariantes da seção 21 do GRS, e via `switch` exaustivo no reducer com checagem de tipo (`never` no `default`) para impedir estados não tratados.
- O reducer deve viver na camada `domain`, e um hook customizado (`useGameEngine`) na camada `application` conecta esse reducer à UI, mantendo o desacoplamento.

---

## ADR-002 — Test runner: Vitest + React Testing Library

**Status:** Aceito

**Contexto:**
Era necessário escolher a base da pirâmide de testes (unitário e componente), entre Jest (padrão histórico) e Vitest (mais recente).

**Decisão:**
**Vitest** para testes unitários (camada `domain`) e de componente, combinado com **React Testing Library** para os testes de componente (camada `presentation`).

**Consequências:**
- ✅ Performance superior a Jest (ESM nativo, sem transpilação pesada), execução em watch mode mais rápida no dia a dia.
- ✅ API compatível com Jest (`describe`, `it`, `expect`), baixa curva de aprendizado.
- ✅ RTL força testes de componente orientados a comportamento (o que o usuário vê/faz), não a detalhes de implementação — alinhado com o objetivo de testar contra o GRS, não contra a estrutura interna dos componentes.
- ⚠️ Ecossistema de plugins um pouco mais novo que o do Jest; mitigado pois os plugins essenciais (coverage via `v8`, integração com Stryker) já são maduros.

---

## ADR-003 — Mutation testing: StrykerJS

**Status:** Aceito

**Contexto:**
O requisito de "pirâmide de testes com teste de mutação" exige uma ferramenta que injete mutações no código-fonte e valide que a suíte de testes as detecta (mata).

**Decisão:**
**StrykerJS** (`@stryker-mutator/core` + `@stryker-mutator/vitest-runner`), rodando com foco prioritário na camada `domain` (Game Engine — reducer, cálculo de distância, fórmula de tempo de exibição, validação de sorteio).

**Consequências:**
- ✅ Única ferramenta madura de mutation testing para TS/JS hoje, com suporte nativo a Vitest.
- ✅ Rodar restrito à camada `domain` mantém o tempo de execução do mutation testing controlado — é ali que a lógica de decisão pura vive e onde mutação tem maior retorno; a camada `presentation` (JSX/Ant Design) tem pouca lógica de branch e mutá-la teria baixo ROI.
- ⚠️ Mutation testing é lento por natureza — deve rodar em pipeline de CI separado (não bloqueante em todo PR), ex: nightly ou em PRs que tocam `domain/`.
- **Meta inicial de mutation score:** 80% na camada `domain`, revisável após o primeiro ciclo real de execução.

---

## ADR-004 — E2E automatizado: Playwright

**Status:** Aceito

**Contexto:**
Precisávamos validar o fluxo completo (Home → Jogo → Resultado) em condições reais de navegador, incluindo o comportamento mobile-first que é requisito central do produto.

**Decisão:**
**Playwright**, configurado com **perfil mobile (viewport de smartphone) como padrão** dos testes E2E, e perfis adicionais de tablet/desktop cobrindo os breakpoints definidos no PRD.

**Consequências:**
- ✅ Emulação de viewport e touch nativa, essencial pois o produto é mobile-first — testamos o dispositivo real de uso primário por padrão, não como exceção.
- ✅ Execução paralela e trace viewer aceleram debug de falhas intermitentes.
- ✅ Suporte cross-browser (Chromium, Firefox, WebKit) cobre o essencial sem precisar de serviço pago de device farm para o MVP.
- Os cenários E2E cobrem meta os critérios de sucesso do PRD (seção 22): completar uma partida até vitória, até derrota, ver o resultado, reiniciar sem reload.

---

## ADR-005 — Gerenciador de pacotes e enforcement de Clean Architecture: pnpm + eslint-plugin-boundaries

**Status:** Aceito

**Contexto:**
Clean Architecture só funciona na prática se violações (ex: um componente de `presentation` importando direto o reducer de `domain`, pulando a camada `application`) forem impedidas por ferramenta, não só por revisão de código.

**Decisão:**
- Gerenciador de pacotes: **pnpm**.
- Enforcement de camadas: **`eslint-plugin-boundaries`**, configurado para que:
  - `domain` não importe nada de `application`, `infrastructure` ou `presentation`.
  - `application` possa importar de `domain` e `infrastructure`, mas não de `presentation`.
  - `presentation` possa importar de `application`, mas nunca diretamente de `domain` ou `infrastructure`.
- Complementado por `@typescript-eslint/no-explicit-any` em modo `error` (zero `any`, incluindo `any` implícito via `strict: true` no `tsconfig`), `eslint-plugin-jsx-a11y` (acessibilidade, requisito do PRD seção 19), e **Prettier** para formatação, integrado ao ESLint via `eslint-config-prettier` (evita conflito de regras).

**Consequências:**
- ✅ Violação de camada quebra o build/CI, não depende de review humano pegar.
- ✅ `pnpm` reduz tempo de instalação e uso de disco em CI comparado a `npm`/`yarn` clássico.
- ⚠️ Configuração inicial de `eslint-plugin-boundaries` exige mapear os "tipos" de pasta corretamente no `.eslintrc`; uma vez feito, é baixo custo de manutenção.

---

## ADR-006 — Hospedagem e Deploy: Next.js Static Export no Cloudflare Pages

**Status:** Aceito (revisado — substitui decisão anterior de GitHub Pages)

**Contexto:**
O produto não possui backend, banco de dados nem necessidade de SSR — tudo roda no client, com LocalStorage. O projeto é open-source, com código no GitHub. A hospedagem em GitHub Pages foi avaliada, mas não oferece preview deployment automático por PR e exige workflow manual de CI para publicar um build Next.js corretamente (branch dedicada, `basePath`/`assetPrefix`).

**Decisão:**
Next.js configurado com **`output: 'export'`** (static export), publicado via **Cloudflare Pages**, conectado diretamente ao repositório GitHub (build automático a cada push, sem workflow de Actions dedicado a deploy).

**Consequências:**
- ✅ Custo zero, sem limite de bandwidth no free tier.
- ✅ **Preview deployment automático por PR**, recuperando a mesma conveniência de revisão que a Vercel oferece — sem precisar sair do free tier.
- ✅ Build automático conectado direto ao repo GitHub: o código-fonte continua 100% no GitHub (mantendo o projeto igualmente "aberto"), só quem serve o site estático é a Cloudflare.
- ✅ CDN de borda global da Cloudflare, HTTPS e domínio customizado gratuitos, rollback de deploy em um clique.
- ✅ Sem servidor Node em produção — apenas arquivos estáticos.
- ⚠️ Adiciona uma dependência de plataforma externa ao GitHub (mitigado por ser um serviço amplamente adotado e gratuito, sem lock-in de código — o repositório permanece portável para qualquer outro host estático a qualquer momento).
- Necessário configurar **browserslist** explícito (últimas 2 versões de Chrome, Safari iOS, Firefox, Edge) alimentando o target de build do SWC — crítico por sermos mobile-first.

---

## ADR-011 — Observação de uso e comportamento: Microsoft Clarity

**Status:** Aceito

**Contexto:**
Sendo um projeto só de front-end, sem backend, era necessário uma forma gratuita de observar uso real e comportamento dos usuários (heatmap, gravação de sessão), complementando o Sentry (ADR-007), que cobre apenas exceções/erros, não comportamento.

**Decisão:**
**Microsoft Clarity** como ferramenta de observação de uso — gravação de sessão e heatmap, **gratuito e sem limite de sessões/mês** (diferente do Hotjar, cujo free tier limita a ~35 sessões/dia).

**Consequências:**
- ✅ Visibilidade de comportamento real (onde o usuário clica, hesita, abandona) sem custo e sem cap de sessões.
- ✅ Complementa o Sentry: Clarity cobre comportamento, Sentry cobre erro técnico. Juntos atendem "observar uso e possíveis bugs".
- ⚠️ **Consequência de conformidade:** coletar dados comportamentais de usuários reais exige **aviso/banner de consentimento de cookies** (LGPD, produto brasileiro), mesmo sendo um projeto simples e sem login.
- Alternativa considerada e descartada por ora: **PostHog** (free tier ~1M eventos/mês, mais completo — analytics de produto + replay + feature flags), registrada como opção de evolução caso o projeto cresça.

---

## ADR-007 — Observabilidade: Error Boundary + Sentry (client-side)

**Status:** Aceito

**Contexto:**
Sem backend, não existe log de servidor. Sem alguma forma de observabilidade, um erro em produção (ex: exceção não tratada durante uma partida) é invisível para o time — só descobrimos se o usuário reportar.

**Decisão:**
- **React Error Boundary** global envolvendo a árvore da aplicação, com fallback amigável ("Ocorreu um erro, reinicie o jogo") em vez de tela branca.
- **Sentry** (plano free/hobby) para captura client-side de exceções não tratadas e erros dentro do Error Boundary, com source maps para stack trace legível.

**Consequências:**
- ✅ Visibilidade real de bugs em produção sem precisar de backend.
- ✅ Fallback de UI evita que um erro no `domain`/reducer quebre a experiência inteira sem explicação.
- ⚠️ Sentry free tier tem limite de eventos/mês — aceitável para volume de MVP, precisa revisão se o produto escalar.

---

## ADR-008 — Contrato e versionamento de dados no LocalStorage

**Status:** Aceito

**Contexto:**
O GRS (seção 19) define o que é persistido (recorde, tempo, contagem de partidas), mas não define **como** validar esses dados ao ler, nem o que fazer se o formato mudar em uma versão futura do app (ex: adicionar um novo campo ao recorde).

**Decisão:**
- Schema de dados do LocalStorage validado com **Zod** no momento da leitura (`infrastructure` layer). Se o dado salvo não bater com o schema esperado (corrompido ou de versão antiga incompatível), o sistema descarta e trata como "sem recorde", nunca quebra a aplicação.
- Chave de armazenamento **versionada no nome**: `flashtap:v1:record`. Uma mudança de schema incompatível no futuro sobe para `v2`, sem tentar migrar dado antigo — simplicidade sobre complexidade de migração, aceitável para dados client-side de baixo valor (apenas recorde local).

**Consequências:**
- ✅ Elimina uma classe inteira de bugs "crash ao ler LocalStorage corrompido ou de versão antiga".
- ✅ Fica documentado e testável (unit test simula LocalStorage corrompido/antigo e valida fallback gracioso).
- ⚠️ Trade-off aceito: usuário perde recorde ao mudarmos de versão de schema — ok dado que é dado de baixo valor e sem persistência de conta/login.

---

## ADR-009 — Padrão de componentes: Container/Presentational

**Status:** Aceito

**Contexto:**
Faltava definir explicitamente o padrão de componente React a ser seguido dentro de `presentation`, para manter consistência e testabilidade via React Testing Library sem precisar mockar hooks em todo componente.

**Decisão:**
Adotar **Container/Presentational** dentro da camada `presentation`:
- `presentation/app/*` → componentes de página ("containers"), únicos que chamam hooks da camada `application` (`useGameEngine`, `useLocalRecord`).
- `presentation/components/*` → componentes "puros" (Board, GameButton, Timer, ReadyCountdown, ResultSummary), recebendo tudo via props, sem chamar hooks de domínio/aplicação — só `useState` local de UI (ex: hover, animação) é permitido.

**Consequências:**
- ✅ Componentes em `presentation/components` são testáveis via RTL passando só props, sem mock de hooks.
- ✅ Reforça o boundary do ADR-005: só o container acessa `application`, o componente puro nunca acessa `domain` diretamente.
- ⚠️ Exige disciplina para não "vazar" uma chamada de hook de aplicação dentro de um componente puro por conveniência — mitigado pela regra do `eslint-plugin-boundaries`.

---

## ADR-010 — Node, dependências e segurança da cadeia de suprimentos

**Status:** Aceito

**Contexto:**
Sem versão de Node fixada e sem processo de atualização/auditoria de dependências, o projeto fica vulnerável a "funciona na minha máquina" e a vulnerabilidades conhecidas não detectadas.

**Decisão:**
- Versão do Node fixada via `.nvmrc` e campo `engines` no `package.json`.
- `pnpm-lock.yaml` commitado (nunca gerado ad-hoc em CI).
- **Dependabot** (ou Renovate) configurado para PRs automáticos de atualização de dependências.
- `pnpm audit` como step no pipeline de CI (não bloqueante no MVP, mas visível/reportado).

**Consequências:**
- ✅ Builds reprodutíveis entre máquinas de dev e CI.
- ✅ Vulnerabilidades conhecidas em dependências não passam despercebidas.
- ⚠️ Dependabot gera ruído de PRs — aceitar revisão em lote periódica (ex: semanal) em vez de merge individual imediato.

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
    theme/              → Design tokens (paleta do GRS seção 8) via ConfigProvider do Ant Design.
    error-boundary/      → Error Boundary global + fallback de UI.

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
| Deploy/Hospedagem | Next.js static export, Cloudflare Pages, preview automático por PR |
| Observação de uso/comportamento | Microsoft Clarity (heatmap + gravação de sessão, gratuito e sem cap) |
| Observabilidade | React Error Boundary + Sentry (free tier) |
| Validação de dados persistidos | Zod, chave versionada (`flashtap:v1:record`) |
| Padrão de componente | Container/Presentational |
| Node/dependências | `.nvmrc` + `engines`, pnpm-lock commitado, Dependabot, `pnpm audit` em CI |
| CI | GitHub Actions: lint → typecheck → unit+component → mutation (PRs em `domain/`) → E2E → deploy |

---

## Riscos e Decisões que Seguem em Aberto (fora da alçada técnica)

- **Orçamento de Sentry**: free tier assumido para o MVP; se o volume de erros/usuários crescer, é decisão de negócio aprovar plano pago.
- **Domínio próprio**: não foi definido se o produto terá domínio customizado (custo/registro) ou ficará no subdomínio padrão do Cloudflare Pages (`projeto.pages.dev`) — decisão de PO/negócio, não técnica.
- **Banner de consentimento de cookies (LGPD)**: necessário por causa do Microsoft Clarity coletar dados comportamentais; conteúdo/texto do banner é decisão de produto, não técnica.
- **Meta de mutation score (80%)**: número inicial definido pelo TL: deve ser revisto com o time após o primeiro ciclo real de execução do Stryker, pode ser ajustado para cima ou para baixo.
