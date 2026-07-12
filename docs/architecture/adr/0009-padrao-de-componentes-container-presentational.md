# ADR-009 — Padrão de componentes: Container/Presentational

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
