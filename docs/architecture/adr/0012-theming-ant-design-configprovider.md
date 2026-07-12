# ADR-012 — Theming: Ant Design ConfigProvider com detecção de `prefers-color-scheme`

**Status:** Aceito

**Contexto:**
O produto passou a exigir suporte a tema claro e escuro (PRD RF-19, GRS seção 8 "Suporte a Tema Claro/Escuro"), com detecção automática da preferência do sistema e alternância manual pelo usuário.

**Decisão:**
- Usar o **`ConfigProvider`** do Ant Design com `theme.algorithm` alternando entre `theme.defaultAlgorithm` (claro) e `theme.darkAlgorithm` (escuro).
- Detecção inicial via media query `prefers-color-scheme: dark`, lida uma única vez na montagem da aplicação (camada `presentation/theme`).
- Override manual do usuário persistido em `flashtap:v1:preferences` (ADR-008); se presente, tem prioridade sobre a preferência do sistema.
- Os design tokens de estado de botão (GRS seção 8: Idle, Showing, Selected, Wrong) são definidos como **duas variantes de paleta** (clara/escura) dentro de `presentation/theme`, nunca hardcoded dentro dos componentes de `presentation/components`.

**Consequências:**
- ✅ Nenhuma lib externa de theming necessária — o Ant Design já resolve a troca de algoritmo nativamente.
- ✅ Centralizar as duas paletas em `presentation/theme` evita duplicação de cor espalhada pelos componentes e facilita auditoria de contraste (WCAG AA) exigida pelo GRS.
- ⚠️ Componentes com cores customizadas fora do sistema de tokens do Ant Design (ex: estados do `GameButton`) precisam consumir o tema via contexto/hook, não via CSS estático — checklist a validar em code review.
