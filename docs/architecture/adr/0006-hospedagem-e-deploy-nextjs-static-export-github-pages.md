# ADR-006 — Hospedagem e Deploy: Next.js Static Export no GitHub Pages

**Status:** Aceito (revisão 2 — substitui a decisão anterior de Cloudflare Pages)

**Contexto:**
O produto não possui backend, banco de dados nem necessidade de SSR — tudo roda no client, com LocalStorage. O projeto é open-source, com código no GitHub. A revisão anterior deste ADR havia migrado de GitHub Pages para Cloudflare Pages em busca de preview deployment automático por PR. Na prática, essa dependência de uma plataforma externa (conta, configuração de dashboard, DNS) se mostrou um custo maior do que o benefício para o estágio atual do projeto: o time optou por manter toda a operação — código, CI e deploy — dentro do próprio GitHub, aceitando abrir mão do preview automático por PR em troca de zero contas externas e zero segredos obrigatórios.

**Decisão:**
Next.js configurado com **`output: 'export'`** (static export), publicado via **GitHub Pages**, com o build e o deploy executados por um workflow de **GitHub Actions** (`.github/workflows/deploy.yml`) disparado a cada push em `main`. O artifact estático (pasta `out/`, com `.nojekyll`) é publicado via `actions/upload-pages-artifact` + `actions/deploy-pages`.

**Consequências:**
- ✅ Custo zero, sem conta ou serviço externo ao GitHub.
- ✅ Código-fonte, CI e deploy 100% dentro do GitHub — nenhum segredo/token de plataforma externa é necessário.
- ✅ HTTPS gratuito em `https://<owner>.github.io/FlashTap` (ou domínio customizado via `CNAME`, se decidido futuramente).
- ✅ Sem servidor Node em produção — apenas arquivos estáticos.
- ⚠️ **Sem preview deployment automático por PR** (GitHub Pages só serve a branch de publicação configurada) — trade-off aceito conscientemente. CI (lint/typecheck/testes/E2E, US-21) continua validando todo PR normalmente; apenas o *deploy* fica restrito ao merge em `main`. Revisão visual de PRs, quando necessária, é feita rodando `pnpm build && pnpm dlx serve out` localmente.
- Necessário configurar **browserslist** explícito (últimas 2 versões de Chrome, Safari iOS, Firefox, Edge) alimentando o target de build do SWC — crítico por sermos mobile-first.
- Necessário configurar `basePath`/`assetPrefix` no Next.js para o caminho do GitHub Pages (`/FlashTap`) e `images: { unoptimized: true }` (o otimizador de imagem do Next exige um servidor, incompatível com export estático).
- Habilitar uma única vez, manualmente, em Settings → Pages → Build and deployment → Source: "GitHub Actions" no repositório (não há API/token disponível para automatizar essa configuração a partir do código).
