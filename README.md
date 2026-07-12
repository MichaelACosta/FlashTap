# FlashTap

Jogo web de memória e reflexo (Next.js + React + TypeScript). Veja [`CLAUDE.md`](CLAUDE.md) para o mapa completo dos documentos-fonte (PRD, Backlog, GRS, ADRs) e convenções do projeto.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — servidor de desenvolvimento
- `pnpm build` — build de produção
- `pnpm lint` — ESLint
- `pnpm format` — Prettier
- `pnpm typecheck` — checagem de tipos sem emitir arquivos
- `pnpm test` — testes unitários e de componente (Vitest)
- `pnpm test:e2e` — testes end-to-end (Playwright)
