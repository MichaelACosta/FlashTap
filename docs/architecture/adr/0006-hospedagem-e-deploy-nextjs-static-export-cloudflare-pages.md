# ADR-006 — Hospedagem e Deploy: Next.js Static Export no Cloudflare Pages

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
