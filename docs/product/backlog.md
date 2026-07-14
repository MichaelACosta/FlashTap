# Backlog Refinado — FlashTap

> Produto: FlashTap
> Escopo: MVP (conforme PRD v2.2, GRS v1.2, ADR v1.4)
> Papéis aplicados: PO+SM (features/histórias), TL (refinamento técnico), SM (APF — Análise de Pontos de Função)

---

## Como ler este documento

Cada história segue a estrutura:

- **Critérios de Aceite** — o que precisa ser verdade pra história ser considerada pronta (rastreado a RF do PRD e seções do GRS).
- **Refinamento Técnico (TL)** — camada de arquitetura envolvida, tarefas técnicas, dependências e riscos.
- **APF (SM)** — classificação pela Análise de Pontos de Função (metodologia IFPUG): tipo de função (EE/SE/CE/ALI), complexidade (Baixa/Média/Alta) e pontuação.

Histórias puramente técnicas/de infraestrutura (Feature 9) não recebem pontuação de APF — a metodologia mede **função de negócio visível ao usuário final**, não trabalho de enablement técnico. Isso é intencional, não uma omissão.

---

## Features (Épicos)

| # | Feature | Resumo |
|---|---|---|
| F0 | Setup do Projeto | Scaffolding, arquitetura, tooling de qualidade (Sprint 0) |
| F1 | Home | Tela inicial, entrada no jogo, exibição de recorde |
| F2 | Onboarding | Modal "Como Jogar" |
| F3 | Motor de Jogo | Sorteio, exibição, seleção, validação, erro |
| F4 | Progressão | Avanço de rodada/nível, vitória |
| F5 | Timer | Cronometragem da partida |
| F6 | Resultado | Telas de Game Over e Vitória |
| F7 | Persistência Local | Recorde e tema salvos no LocalStorage |
| F9 | Enablers Técnicos | CI/CD, deploy, observabilidade, consentimento |

---

## F0 — Setup do Projeto

> Feature técnica (Sprint 0) — pré-requisito para todas as demais. Sem pontuação de APF (mesma justificativa de F9: não é função de negócio visível ao usuário final).

### US-00a — Inicializar projeto Next.js + TypeScript

**Como** time, **queremos** o projeto Next.js (App Router) inicializado com TypeScript em modo `strict`, **para** ter a base de todo o desenvolvimento.

**Refinamento Técnico (TL):** `create-next-app` com template TS; `tsconfig.json` com `strict: true` e sem permitir `any` implícito; `.nvmrc` fixando versão do Node (ADR-010); `pnpm` como gerenciador de pacotes (ADR-005).

---

### US-00b — Estruturar pastas conforme Clean Architecture

**Como** time, **queremos** a estrutura de pastas `domain/application/infrastructure/presentation` criada desde o início, **para** que nenhuma feature seja construída fora do padrão arquitetural.

**Refinamento Técnico (TL):** criar esqueleto de pastas vazio (com um arquivo `index.ts` ou `.gitkeep` por camada); configurar `eslint-plugin-boundaries` já nesta etapa, com regras de importação entre camadas ativas desde o primeiro commit (ADR-005) — evita que a primeira feature real já nasça violando o boundary.

---

### US-00c — Configurar ESLint + Prettier

**Como** time, **queremos** lint e formatação automatizados desde o commit zero, **para** manter consistência de código em todo o projeto.

**Refinamento Técnico (TL):** ESLint com `@typescript-eslint/no-explicit-any: error`, `eslint-plugin-jsx-a11y`, `eslint-plugin-boundaries` (ADR-005); Prettier integrado via `eslint-config-prettier`; script `pnpm lint` e `pnpm format` no `package.json`.

---

### US-00d — Instalar e configurar Ant Design

**Como** time, **queremos** o Ant Design instalado e o `ConfigProvider` base configurado, **para** que os componentes de UI tenham fundação de tema desde o início.

**Refinamento Técnico (TL):** instalar `antd`; configurar `ConfigProvider` em `presentation/theme` com os dois algoritmos (claro/escuro, ADR-012) já no esqueleto, mesmo antes de qualquer tela real existir.

---

### US-00e — Configurar pirâmide de testes (scaffolding)

**Como** time, **queremos** Vitest, React Testing Library, StrykerJS e Playwright instalados e configurados com um teste trivial passando em cada camada, **para** validar que o pipeline de qualidade funciona antes de escrever a primeira feature.

**Refinamento Técnico (TL):** `vitest.config.ts`, `stryker.conf.json` (apontando para `domain`, ADR-003), `playwright.config.ts` com perfil mobile como padrão (ADR-004); um teste unitário trivial em `domain`, um de componente em `presentation`, e um E2E de "app carrega" — só para provar que o pipeline de CI (US-21) tem o que rodar.

---

## F1 — Home

### US-01 — Exibir tela inicial

**Como** jogador, **quero** ver logo, botão "Jogar" e meu melhor recorde ao abrir o app, **para** começar uma partida rapidamente.

**Critérios de Aceite** (PRD RF — seção 13 "Home")
- Exibe logo/wordmark do FlashTap.
- Exibe botão "Jogar" que leva à tela de Jogo (ou ao modal de onboarding, se primeiro acesso — ver US-03).
- Exibe o melhor recorde local, se existir.

**Refinamento Técnico (TL)**
- Camada: `presentation/app` (container `HomePage`) consumindo `application/useLocalRecord`.
- Tarefas: montar layout responsivo mobile-first; ler recorde via hook; renderizar logo (SVG) definido no design system.
- Dependências: US-17 (persistência do recorde) precisa existir para ler valor real; pode ser mockado em paralelo.
- Risco: baixo — tela estática, sem lógica de negócio complexa.

**APF (SM)**
- Tipo: **SE** (Saída Externa) — apresenta dado derivado (recorde) já processado.
- Referencia 1 ALI (Recorde Local), ~3 DETs (nome do jogo, valor do recorde, ação jogar).
- Complexidade: **Baixa** → **4 PF**.

---

### US-02 — Estado vazio do recorde

**Como** jogador sem partidas concluídas, **quero** ver "—" no lugar do recorde, **para** entender que ainda não tenho histórico.

**Critérios de Aceite** (PRD RF-20)
- Se não houver recorde salvo, exibir literalmente "—" no campo de recorde da Home.

**Refinamento Técnico (TL)**
- Camada: `application/useLocalRecord` retorna `null`/`undefined` quando não há dado; `presentation/components/RecordChip` trata o caso e renderiza "—".
- Tarefas: teste unitário garantindo fallback gracioso quando LocalStorage está vazio ou corrompido (ver ADR-008).
- Dependência: US-18 (validação de dados persistidos).
- Risco: baixo.

**APF (SM)**
- Tipo: **CE** (Consulta Externa) — consulta simples sem processamento derivado adicional.
- Complexidade: **Baixa** → **3 PF**.

---

## F2 — Onboarding

### US-03 — Modal "Como Jogar" no primeiro acesso

**Como** jogador novo, **quero** ver uma explicação rápida da mecânica antes da minha primeira partida, **para** entender como jogar sem precisar descobrir sozinho.

**Critérios de Aceite** (PRD RF-18)
- Exibido automaticamente antes da primeira partida do usuário (nunca durante uma partida em andamento).
- Não reaparece automaticamente em acessos futuros (flag persistida).

**Refinamento Técnico (TL)**
- Camada: `presentation/components/HowToPlayModal` (puro/presentational) + `application/useTutorialFlag` consultando `infrastructure` (chave `flashtap:v1:tutorial-seen`, ADR-008).
- Tarefas: modal em bottom-sheet (mobile-first); lógica de exibição condicional no container `HomePage`; persistir flag ao fechar.
- Dependência: ADR-008 (schema Zod da chave `tutorial-seen`).
- Risco: baixo. Atenção a acessibilidade (foco preso no modal, fechável por teclado/Esc).

**APF (SM)**
- Tipo: **SE** — apresenta conteúdo condicionado a um dado de controle (1 ALI: tutorial-seen).
- Complexidade: **Baixa** → **4 PF**.

---

### US-04 — Reabrir modal manualmente

**Como** jogador, **quero** reabrir "Como Jogar" a qualquer momento clicando num ícone de ajuda, **para** relembrar as regras quando quiser.

**Critérios de Aceite** (PRD RF-18, seção 25 "Onboarding")
- Ícone de ajuda visível na tela de Jogo.
- Ao clicar, abre o mesmo modal, independente da flag de "já visto".

**Refinamento Técnico (TL)**
- Camada: `presentation/components/HelpButton` disparando o mesmo `HowToPlayModal` de US-03 (reuso de componente).
- Tarefas: garantir que abrir o modal manualmente não interfere no estado da partida em andamento (máquina de estados do GRS deve pausar/não pausar — decisão de UX a confirmar).
- Risco: médio — decidir se abrir o modal no meio de uma rodada pausa o timer/exibição ou não (não coberto explicitamente pelo GRS ainda).

**APF (SM)**
- Tipo: **EE** (Entrada Externa) — ação do usuário que aciona exibição de tela.
- Complexidade: **Baixa** → **3 PF**.

---

## F3 — Motor de Jogo

### US-05 — Sortear e exibir a sequência (estado Showing)

**Como** jogador, **quero** ver N botões acenderem aleatoriamente no início da rodada, **para** memorizar a sequência antes de responder.

**Critérios de Aceite** (GRS seções 6, 7, 8 "Showing")
- Sorteio gera N botões únicos, sem repetição, distribuição uniforme.
- Botões sorteados assumem estado "Showing" (cor + pulso de glow).
- Tempo de exibição segue a fórmula `800 + N×300`, teto 4000ms.

**Refinamento Técnico (TL)**
- Camada: `domain` (função pura de sorteio + reducer de transição de estado), `presentation/components/GameButton` (variante visual "Showing").
- Tarefas: implementar gerador de sorteio determinístico e testável (seed injetável para testes); implementar timer de exibição via `useEffect` no hook `useGameEngine`.
- Dependência: nenhuma (função raiz do motor de jogo).
- Risco: médio — mutation testing (ADR-003) deve cobrir bem essa função, é candidata natural a bugs sutis (ex: sorteio com repetição).

**APF (SM)**
- Tipo: **EE** — processa lógica de negócio (sorteio) e referencia 1 FTR (estado da partida).
- Complexidade: **Média** (lógica de geração + validação de unicidade) → **4 PF**.

---

### US-06 — Ocultar sequência após tempo de exibição

**Como** jogador, **quero** que a sequência apague sozinha após o tempo calculado, **para** poder começar a responder.

**Critérios de Aceite** (GRS seção 7)
- Após o tempo de exibição, todos os botões "Showing" retornam a "Idle".
- Interação é liberada somente após esse momento (GRS seção 7, passo 5).

**Refinamento Técnico (TL)**
- Camada: `domain` (reducer transiciona `ShowingSequence` → `WaitingInput`), `presentation` apenas reflete o estado.
- Tarefas: garantir que cliques durante "Showing" sejam ignorados (GRS seção 10).
- Risco: baixo, mas testar race condition (clique no exato momento da transição) via teste de componente.

**APF (SM)**
- Tipo: **SE** — transição de estado com efeito visual, sem novo dado de negócio.
- Complexidade: **Baixa** → **4 PF**.

---

### US-07 — Selecionar botões corretos (estado Selected)

**Como** jogador, **quero** que os botões corretos que eu clicar fiquem visualmente marcados, **para** saber o que já selecionei.

**Critérios de Aceite** (GRS seções 8 "Selected", 10)
- Clique em botão pertencente à sequência muda estado para "Selected" (cor + ícone de check) e desabilita novo clique nele.
- Clique novamente em botão já "Selected": nada acontece (GRS seção 10).

**Refinamento Técnico (TL)**
- Camada: `domain` (reducer valida se índice clicado pertence à sequência ativa), `presentation/components/GameButton`.
- Tarefas: implementar action `SELECT_BUTTON` no reducer; testes unitários cobrindo clique duplicado e clique fora da sequência (este último cruza com US-08).
- Risco: baixo.

**APF (SM)**
- Tipo: **EE** — valida entrada do usuário contra 1 FTR (sequência ativa).
- Complexidade: **Média** → **4 PF**.

---

### US-08 — Erro ao clicar botão incorreto (estado Wrong + fim de partida)

**Como** jogador, **quero** que a partida termine imediatamente se eu errar um botão, **para** a mecânica de risco/velocidade ser real.

**Critérios de Aceite** (GRS seções 8 "Wrong", 11, 16)
- Clique em botão fora da sequência ativa: partida encerra instantaneamente, sem precisar de "Enviar".
- Botão errado assume estado "Wrong" (cor + shake).
- Timer é interrompido; tela de Game Over exibe progresso, tempo, distância e recorde (não revela a sequência completa).

**Refinamento Técnico (TL)**
- Camada: `domain` (reducer transiciona para `GameOver`, calcula distância — ver GRS seção 17), `application/useLocalRecord` (compara com recorde salvo), `presentation` (tela de Game Over).
- Tarefas: cálculo de distância (fórmula baseada em nível/rodada atual vs. nível 12/rodada 5); integração com Sentry não se aplica aqui (não é exceção, é fluxo esperado).
- Dependência: US-17 (comparação/atualização de recorde).
- Risco: **alto relativo** — é a história com mais regras de negócio combinadas (estado + cálculo de distância + comparação de recorde); prioridade alta de cobertura por mutation testing.

**APF (SM)**
- Tipo: **EE** — cruza múltiplos FTRs (estado da partida, cálculo de distância, recorde local).
- Complexidade: **Alta** (>2 FTRs referenciados) → **6 PF**.

---

### US-09 — Habilitar "Enviar" condicionalmente

**Como** jogador, **quero** que o botão "Enviar" só fique clicável quando eu tiver selecionado todos os botões certos, **para** não confirmar uma rodada incompleta.

**Critérios de Aceite** (GRS seção 12)
- "Enviar" inicia desabilitado.
- Habilita somente quando `quantidade de Selected == quantidade da sequência`.

**Refinamento Técnico (TL)**
- Camada: `domain` (derivar `isSubmitEnabled` do estado), `presentation/components/SubmitButton`.
- Tarefas: teste unitário parametrizado (N=1 até N=12) validando a condição de habilitação.
- Risco: baixo.

**APF (SM)**
- Tipo: **EE** — regra de habilitação condicional simples.
- Complexidade: **Baixa** → **3 PF**.

---

## F4 — Progressão

### US-10 — Avançar rodada automaticamente

**Como** jogador, **quero** avançar para a próxima rodada automaticamente ao acertar, **para** continuar jogando sem fricção.

**Critérios de Aceite** (GRS seção 14, PRD RF-11)
- Ao validar rodada com sucesso e `rodada < 5`: incrementa rodada, gera nova sequência (nível mantido).

**Refinamento Técnico (TL)**
- Camada: `domain` (reducer, action `SUBMIT_ROUND_SUCCESS`).
- Tarefas: encadear corretamente com US-05 (nova sequência) sem duplicar timer (GRS seção 18 — timer nunca reinicia entre rodadas).
- Risco: baixo.

**APF (SM)**
- Tipo: **EE** — atualiza estado de progresso (1 FTR).
- Complexidade: **Média** → **4 PF**.

---

### US-11 — Avançar nível após 5 rodadas

**Como** jogador, **quero** subir de nível ao concluir as 5 rodadas, **para** sentir a dificuldade aumentando.

**Critérios de Aceite** (GRS seção 14, PRD RF-12)
- Ao validar a 5ª rodada de um nível: `nível++`, `rodada = 1`.
- Novo nível aumenta N (quantidade de botões sorteados) e o tempo de exibição (fórmula GRS seção 7).

**Refinamento Técnico (TL)**
- Camada: `domain`.
- Tarefas: teste unitário cobrindo a transição 5→1 de rodada e o incremento de nível; validar recalculo do tempo de exibição a cada nível.
- Risco: baixo.

**APF (SM)**
- Tipo: **EE** — atualiza 1 FTR com regra de recálculo derivado.
- Complexidade: **Média** → **4 PF**.

---

### US-12 — Vencer o jogo (Nível 12, Rodada 5)

**Como** jogador, **quero** ver uma tela de vitória ao completar o nível 12, **para** ter uma conclusão clara e satisfatória.

**Critérios de Aceite** (GRS seção 15, PRD RF-16)
- Ao validar a rodada 5 do nível 12: estado muda para `Victory`.
- Timer é interrompido; recorde é comparado/atualizado (ver US-17).

**Refinamento Técnico (TL)**
- Camada: `domain` (transição final da máquina de estados), `presentation/app` (tela de Vitória).
- Tarefas: garantir que `Victory` e `GameOver` (US-08) compartilhem a mesma lógica de cálculo de tempo/recorde, evitando duplicação de código.
- Risco: baixo.

**APF (SM)**
- Tipo: **SE** — apresenta resultado final derivado (tempo, comparação de recorde).
- Complexidade: **Média** → **5 PF**.

---

## F5 — Timer

### US-13 — Cronômetro contínuo da partida

**Como** jogador, **quero** ver o tempo total decorrido desde o início da partida, **para** acompanhar minha performance.

**Critérios de Aceite** (GRS seção 18, PRD RF-13)
- Timer inicia ao fim do countdown de preparação (estado `Ready`).
- Nunca reinicia entre rodadas.
- Encerra apenas em Vitória ou Game Over.

**Refinamento Técnico (TL)**
- Camada: `application/useGameTimer` (hook isolado, testável com fake timers).
- Tarefas: usar `performance.now()` em vez de `Date.now()` para precisão e resiliência a mudanças de relógio do sistema.
- Risco: baixo, mas atenção a comportamento em background tab (throttling do navegador) — não bloqueante para MVP.

**APF (SM)**
- Tipo: **SE** — saída contínua de um único dado (tempo decorrido).
- Complexidade: **Baixa** → **4 PF**.

---

## F6 — Resultado

### US-14 — Tela de Game Over

**Como** jogador, **quero** ver tempo, progresso, distância e recorde ao perder, **para** entender meu desempenho na partida.

**Critérios de Aceite** (GRS seção 16, PRD seção 10)
- Exibe: tempo total, progresso (nível.rodada), distância até nível 12, recorde atual.
- Não revela a sequência completa correta — apenas o botão errado (estado Wrong).
- Permite reiniciar.

**Refinamento Técnico (TL)**
- Camada: `presentation/app/ResultPage` (container) + `presentation/components/ResultSummary` (puro).
- Tarefas: reutilizar cálculo de distância de US-08; botão "Jogar Novamente" reresetando o reducer sem reload (US-16).
- Risco: baixo.

**APF (SM)**
- Tipo: **SE** — múltiplos DETs (tempo, progresso, distância, recorde) referenciando 1 ALI.
- Complexidade: **Média** → **5 PF**.

---

### US-15 — Tela de Vitória

**Como** jogador, **quero** ver uma tela de vitória distinta ao completar o jogo, **para** ter uma sensação de conquista clara.

**Critérios de Aceite** (GRS seção 15, PRD RF-16)
- Mesma estrutura de dados de US-14, com tratamento visual distinto (não é "derrota").

**Refinamento Técnico (TL)**
- Camada: reuso de `ResultSummary` com variante `outcome="victory"`.
- Tarefas: variante visual (cores/ícone de vitória) sem duplicar lógica de cálculo.
- Risco: baixo.

**APF (SM)**
- Tipo: **SE** — mesma estrutura de dados de US-14, tratada como função distinta por ser uma saída externa diferente ao usuário.
- Complexidade: **Média** → **5 PF**.

---

### US-16 — Jogar novamente sem recarregar

**Como** jogador, **quero** iniciar uma nova partida direto da tela de resultado, **para** repetir rapidamente sem esperar reload de página.

**Critérios de Aceite** (PRD RF, seção 22 "Critérios de Sucesso")
- Botão "Jogar Novamente" reseta o estado da partida (nível 1, rodada 1, timer zerado) sem `location.reload()`.

**Refinamento Técnico (TL)**
- Camada: `domain` (action `RESET_GAME` no reducer).
- Tarefas: garantir que o reset não afeta o recorde persistido (camadas distintas: estado de partida vs. `infrastructure`).
- Risco: baixo.

**APF (SM)**
- Tipo: **EE** — reseta estado interno, sem novo dado externo.
- Complexidade: **Baixa** → **3 PF**.

---

## F7 — Persistência Local (Recorde e Tema)

### US-17 — Persistir recorde localmente

**Como** jogador, **quero** que meu melhor progresso e tempo sejam salvos no navegador, **para** acompanhar minha evolução entre sessões.

**Critérios de Aceite** (GRS seção 19, PRD RF-14)
- Recorde = maior progresso; empate desempatado por menor tempo.
- Persistido em `flashtap:v1:record` (ADR-008), validado com Zod na leitura.
- Atualizado automaticamente quando superado.

**Refinamento Técnico (TL)**
- Camada: `infrastructure/localStorageAdapter` (implementa schema Zod), `application/useLocalRecord`.
- Tarefas: função pura de comparação de recorde (`domain`) + efeito de gravação (`infrastructure`), mantendo o `domain` livre de I/O (ADR arquitetura).
- Risco: baixo, mas cobrir teste de "quase empate" (mesmo progresso, tempo diferente).

**APF (SM)**
- Esta história também **define o dado** (função de dados, não de transação):
  - **ALI** (Arquivo Lógico Interno) "Recorde Local" — 1 RET, poucos DETs (nível, rodada, tempo) → Complexidade **Baixa** → **7 PF**.
  - **EI** (gravação do recorde) — Complexidade **Baixa** → **3 PF**.
- **Total da história: 10 PF.**

---

### US-18 — Robustez contra dados corrompidos/antigos

**Como** jogador, **quero** que o jogo não quebre se o dado salvo estiver corrompido ou de uma versão antiga, **para** ter uma experiência confiável mesmo após updates do app.

**Critérios de Aceite** (ADR-008)
- Dado inválido (schema Zod falha): tratado como "sem recorde", nunca lança exceção não tratada.
- Mudança de schema incompatível sobe a chave para nova versão (`v2`), sem tentar migrar.

**Refinamento Técnico (TL)**
- Camada: `infrastructure/localStorageAdapter`.
- Tarefas: teste unitário simulando LocalStorage corrompido (string inválida, JSON malformado, schema de versão antiga); garantir que o Error Boundary (ADR-007) nem precisa entrar em ação aqui — é tratado antes.
- Risco: baixo, mas alto valor de mutation testing (é código puramente defensivo, fácil de "esquecer" um caso).

**APF (SM)**
- Tipo: **CE** — consulta com validação, sem gravação.
- Complexidade: **Média** (lógica condicional de fallback) → **4 PF**.

---

### US-19 — Detectar tema do sistema automaticamente

**Como** jogador, **quero** que o app abra no tema (claro/escuro) que já uso no meu sistema, **para** ter conforto visual sem precisar configurar nada.

**Critérios de Aceite** (PRD RF-19)
- Detecta `prefers-color-scheme` na montagem da aplicação.
- Aplica tema correspondente via Ant Design `ConfigProvider` (ADR-012).

**Refinamento Técnico (TL)**
- Camada: `presentation/theme` (hook `useSystemTheme`).
- Tarefas: teste de componente simulando media query dark/light.
- Risco: baixo.

**APF (SM)**
- Tipo: **CE** — leitura de preferência do ambiente, sem FTR interno.
- Complexidade: **Baixa** → **3 PF**.

---

### US-20 — Alternar e persistir tema manualmente

**Como** jogador, **quero** poder trocar manualmente entre tema claro e escuro, **para** escolher minha preferência independente do sistema.

**Critérios de Aceite** (PRD RF-19, ADR-012)
- Toggle manual disponível na interface.
- Preferência manual tem prioridade sobre `prefers-color-scheme` e é persistida (`flashtap:v1:preferences`).

**Refinamento Técnico (TL)**
- Camada: `presentation/theme` + `infrastructure` (nova chave versionada, ADR-008).
- Tarefas: schema Zod para preferências; sincronizar estado do `ConfigProvider` com o valor persistido na montagem.
- Risco: baixo.

**APF (SM)**
- Define novo dado (função de dados) + ação de gravação:
  - **ALI** "Preferências" — Complexidade **Baixa** → **7 PF**.
  - **EI** (gravação da escolha de tema) — Complexidade **Baixa** → **3 PF**.
- **Total da história: 10 PF.**

---

## F9 — Enablers Técnicos (sem pontuação de APF)

> Histórias técnicas/de infraestrutura. Não representam função de negócio visível ao usuário final, portanto não recebem APF — são estimadas por esforço técnico (ex: story points), não por Análise de Pontos de Função.

### US-21 — Pipeline de CI

**Como** time, **queremos** lint, typecheck, testes unitários/componente, mutação e E2E rodando automaticamente a cada PR, **para** garantir qualidade antes do merge.

**Refinamento Técnico (TL):** GitHub Actions conforme ADR-002 a ADR-004; mutation testing (Stryker) restrito à camada `domain` para não travar o pipeline (ADR-003).

---

### US-22 — Deploy automático no GitHub Pages

**Como** time, **queremos** deploy automático no GitHub Pages a cada push em `main`, **para** publicar a versão mais recente sem depender de conta ou plataforma externa ao GitHub.

**Refinamento Técnico (TL):** conforme ADR-006 (revisão 2); configurar `output: 'export'` no Next.js e publicar via workflow de GitHub Actions (`actions/upload-pages-artifact` + `actions/deploy-pages`). Sem preview automático por PR — trade-off aceito; CI (US-21) já valida todo PR antes do merge.

---

### US-23 — Observabilidade de erros

**Como** time, **queremos** Error Boundary global + Sentry, **para** ter visibilidade de bugs em produção sem backend.

**Refinamento Técnico (TL):** conforme ADR-007; fallback de UI amigável; captura de exceções não tratadas do reducer.

---

### US-24 — Observação de uso + consentimento

**Como** time, **queremos** Microsoft Clarity integrado com banner de consentimento de cookies, **para** observar comportamento de uso respeitando a LGPD.

**Refinamento Técnico (TL):** conforme ADR-011; banner de consentimento bloqueia carregamento do script do Clarity até aceite explícito do usuário.

---

## Sumário de APF por Feature

| Feature | Histórias | APF (não ajustado) |
|---|---|---|
| F0 — Setup do Projeto | US-00a a US-00e | N/A (não pontuável) |
| F1 — Home | US-01, US-02 | 7 |
| F2 — Onboarding | US-03, US-04 | 7 |
| F3 — Motor de Jogo | US-05 a US-09 | 21 |
| F4 — Progressão | US-10 a US-12 | 13 |
| F5 — Timer | US-13 | 4 |
| F6 — Resultado | US-14 a US-16 | 13 |
| F7 — Persistência | US-17 a US-20 | 27 |
| F9 — Enablers Técnicos | US-21 a US-24 | N/A (não pontuável) |
| **Total** | **29 histórias** | **92 PF** |

**Nota metodológica:** os 92 PF são a contagem **não ajustada** (PFNA). Uma contagem formal completa (IFPUG) aplicaria ainda um Fator de Ajuste (VAF) baseado nas 14 características gerais do sistema (ex: performance, reusabilidade, facilidade operacional) — omitido aqui por ser um MVP pequeno e majoritariamente client-side, onde esse ajuste tende a ficar próximo de neutro. Se quiser, esse ajuste pode ser calculado à parte.
