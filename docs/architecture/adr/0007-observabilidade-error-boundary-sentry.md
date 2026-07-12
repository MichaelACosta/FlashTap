# ADR-007 — Observabilidade: Error Boundary + Sentry (client-side)

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
