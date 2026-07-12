# ADR-003 — Mutation testing: StrykerJS

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
