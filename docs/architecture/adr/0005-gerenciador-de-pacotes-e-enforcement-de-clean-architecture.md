# ADR-005 — Gerenciador de pacotes e enforcement de Clean Architecture: pnpm + eslint-plugin-boundaries

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
