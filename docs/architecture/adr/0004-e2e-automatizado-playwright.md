# ADR-004 — E2E automatizado: Playwright

**Status:** Aceito

**Contexto:**
Precisávamos validar o fluxo completo (Home → Jogo → Resultado) em condições reais de navegador, incluindo o comportamento mobile-first que é requisito central do produto.

**Decisão:**
**Playwright**, configurado com **perfil mobile (viewport de smartphone) como padrão** dos testes E2E, e perfis adicionais de tablet/desktop cobrindo os breakpoints definidos no PRD.

**Consequências:**
- ✅ Emulação de viewport e touch nativa, essencial pois o produto é mobile-first — testamos o dispositivo real de uso primário por padrão, não como exceção.
- ✅ Execução paralela e trace viewer aceleram debug de falhas intermitentes.
- ✅ Suporte cross-browser (Chromium, Firefox, WebKit) cobre o essencial sem precisar de serviço pago de device farm para o MVP.
- Os cenários E2E cobrem meta os critérios de sucesso do PRD (seção 22): completar uma partida até vitória, até derrota, ver o resultado, reiniciar sem reload.
