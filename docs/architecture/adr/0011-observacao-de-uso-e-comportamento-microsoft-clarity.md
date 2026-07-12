# ADR-011 — Observação de uso e comportamento: Microsoft Clarity

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
