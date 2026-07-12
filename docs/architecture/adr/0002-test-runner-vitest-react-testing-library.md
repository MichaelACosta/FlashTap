# ADR-002 — Test runner: Vitest + React Testing Library

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
