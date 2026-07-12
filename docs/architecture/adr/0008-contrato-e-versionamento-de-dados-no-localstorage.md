# ADR-008 — Contrato e versionamento de dados no LocalStorage

**Status:** Aceito

**Contexto:**
O GRS (seção 19) define o que é persistido (recorde, tempo, contagem de partidas), mas não define **como** validar esses dados ao ler, nem o que fazer se o formato mudar em uma versão futura do app (ex: adicionar um novo campo ao recorde).

**Decisão:**
- Schema de dados do LocalStorage validado com **Zod** no momento da leitura (`infrastructure` layer). Se o dado salvo não bater com o schema esperado (corrompido ou de versão antiga incompatível), o sistema descarta e trata como "sem recorde", nunca quebra a aplicação.
- Chave de armazenamento **versionada no nome**: `flashtap:v1:record`. Uma mudança de schema incompatível no futuro sobe para `v2`, sem tentar migrar dado antigo — simplicidade sobre complexidade de migração, aceitável para dados client-side de baixo valor (apenas recorde local).
- Duas chaves adicionais, mesmo padrão de versionamento: `flashtap:v1:preferences` (tema escolhido manualmente, se houver override do `prefers-color-scheme`) e `flashtap:v1:tutorial-seen` (flag booleana controlando se o modal "Como Jogar" já foi exibido — ver PRD RF-18).

**Consequências:**
- ✅ Elimina uma classe inteira de bugs "crash ao ler LocalStorage corrompido ou de versão antiga".
- ✅ Fica documentado e testável (unit test simula LocalStorage corrompido/antigo e valida fallback gracioso).
- ✅ Cada chave é independente e versionada isoladamente — perder o recorde por mudança de schema não afeta a preferência de tema nem a flag de tutorial, e vice-versa.
- ⚠️ Trade-off aceito: usuário perde recorde/preferências ao mudarmos de versão de schema — ok dado que é dado de baixo valor e sem persistência de conta/login.
