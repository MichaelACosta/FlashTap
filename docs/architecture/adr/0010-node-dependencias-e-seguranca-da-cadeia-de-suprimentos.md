# ADR-010 — Node, dependências e segurança da cadeia de suprimentos

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
