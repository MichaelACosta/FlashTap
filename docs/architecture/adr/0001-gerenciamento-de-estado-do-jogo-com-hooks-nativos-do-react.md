# ADR-001 — Gerenciamento de estado do jogo com hooks nativos do React

**Status:** Aceito

**Contexto:**
O GRS (seção 20) define uma máquina de estados formal para o ciclo de uma partida (`Idle → Ready → ShowingSequence → WaitingInput → ReadyToSubmit → Validating → RoundCompleted → NextRound/NextLevel → Victory/GameOver`). Era cogitado o uso de uma lib de state machine (ex: XState) para modelar isso com garantias formais de transição.

**Decisão:**
O Game Engine será implementado usando **apenas hooks nativos do React** (`useReducer` para a máquina de estados, `useState`/`useEffect` onde couber), sem bibliotecas externas de state machine. A lógica de transição de estados é modelada como um **reducer puro** (`(state, action) => state`), testável isoladamente sem renderizar nenhum componente React.

**Consequências:**
- ✅ Menor superfície de dependências externas; qualquer dev React consegue ler o código sem aprender uma API nova.
- ✅ O reducer, por ser uma função pura, continua 100% testável fora da UI (mantém a Clean Architecture: `domain` não depende de `presentation`).
- ⚠️ As garantias de "transição impossível" que uma lib como XState oferece por construção não existem aqui — precisam ser garantidas via testes (unitário + mutação) cobrindo os Invariantes da seção 21 do GRS, e via `switch` exaustivo no reducer com checagem de tipo (`never` no `default`) para impedir estados não tratados.
- O reducer deve viver na camada `domain`, e um hook customizado (`useGameEngine`) na camada `application` conecta esse reducer à UI, mantendo o desacoplamento.
