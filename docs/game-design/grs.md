# Game Rules Specification (GRS)

> Produto: FlashTap
> Versão: 1.2
> Status: MVP

---

# 1. Objetivo

Este documento define todas as regras do jogo FlashTap.

Qualquer implementação da Game Engine deverá seguir este documento.

---

# 2. Glossário

| Termo | Definição |
|---------|-----------|
| Nível | Quantidade de botões corretos da rodada |
| Rodada | Uma tentativa dentro de um nível |
| Progresso | Representação textual no formato `nível.rodada` |
| Game Engine | Responsável por executar todas as regras do jogo |
| Sequência | Conjunto de botões sorteados para uma rodada |
| Seleção | Conjunto de botões escolhidos pelo jogador |

---

# 3. Estrutura do Tabuleiro

O tabuleiro possui exatamente **12 botões de ação**, organizados em uma grade de **4 linhas × 3 colunas**, mais uma **5ª linha exclusiva contendo o botão "Enviar"** (não é um botão de ação/sequência, não participa do sorteio).

Cada botão de ação possui um identificador único.

```text
1  2  3

4  5  6

7  8  9

10 11 12

[      Enviar      ]
```

Os identificadores nunca mudam durante uma partida.

---

# 4. Estrutura do Jogo

O jogo possui:

- 12 níveis

Cada nível possui:

- 5 rodadas

Cada rodada possui:

- uma sequência aleatória

---

# 5. Progressão

## Nível

O nível determina quantos botões serão sorteados.

Exemplo

| Nível | Botões |
|---------|--------|
|1|1|
|2|2|
|3|3|
|4|4|
|5|5|
|6|6|
|7|7|
|8|8|
|9|9|
|10|10|
|11|11|
|12|12|

---

## Rodadas

Cada nível possui exatamente cinco rodadas.

Exemplo

```text
1.1

1.2

1.3

1.4

1.5

↓

2.1
```

---

# 6. Sorteio

Cada rodada gera uma nova sequência.

Regras:

- utilizar números únicos
- nunca repetir posições dentro da mesma rodada
- distribuição uniforme
- ordem da lista não possui significado

Exemplo

Nível 4

```text
2

4

7

10
```

---

# 7. Exibição

Ao iniciar uma rodada:

1. bloquear interação
2. destacar botões corretos
3. aguardar tempo de exibição (ver fórmula abaixo)
4. ocultar sequência
5. liberar interação

## Fórmula do Tempo de Exibição

O tempo de exibição escala com o nível atual (N = quantidade de botões da rodada), tornando a memorização proporcionalmente mais desafiadora nos níveis mais altos:

```text
tempo_exibicao (ms) = 800 + (N × 300)

teto máximo = 4000 ms
```

Exemplo:

| Nível (N) | Tempo de exibição |
|---|---|
| 1 | 1100ms |
| 5 | 2300ms |
| 9 | 3500ms |
| 11 | 4000ms (teto atingido) |
| 12 | 4000ms (teto atingido) |

---

# 8. Estados dos Botões

Cada botão pode assumir apenas um estado. Todo estado deve ser diferenciável tanto por cor quanto por um reforço visual não-cromático (ícone/animação), garantindo acessibilidade para daltonismo (protanopia/deuteranopia).

## Idle

Cor: cinza-lavanda neutro.

Disponível, sem interação especial.

---

## Showing

Cor: âmbar/coral vibrante.

Reforço: pulso de glow (animação de brilho + leve escala).

Exibindo a sequência sorteada. Sem interação.

---

## Selected

Cor: teal/menta.

Reforço: ícone de check + pequena animação de "pop" (escala) ao ser selecionado.

Selecionado corretamente. Desabilitado — não aceita novo clique.

---

## Wrong

Cor: vermelho-carmim.

Reforço: shake (tremor) + ícone de X.

Exibido apenas no botão clicado incorretamente, no momento do Game Over. Não substitui nem revela os demais botões da sequência.

---

## Suporte a Tema Claro/Escuro

Os 4 estados acima (Idle, Showing, Selected, Wrong) devem ter uma variante de cor calibrada para tema claro e outra para tema escuro, mantendo o mesmo significado semântico e o mesmo reforço não-cromático (ícone/animação) em ambos os temas. O contraste mínimo (WCAG AA) deve ser validado nas duas variantes, não apenas na variante clara.

---

# 9. Fluxo da Rodada

```text
Gerar sequência

↓

(Ready) Countdown de preparação — apenas na primeira rodada da partida

↓

Mostrar sequência

↓

Ocultar sequência

↓

Liberar interação

↓

Selecionar botões

↓

Enviar

↓

Validar
```

---

# 10. Seleção

Durante a seleção:

O jogador poderá clicar apenas em botões ainda disponíveis (estado Idle).

Ao clicar em um botão correto (pertencente à sequência):

- muda para Selected (verde/teal)
- fica desabilitado

Ao clicar novamente em um botão já Selected:

Nada acontece.

---

# 11. Erro

O jogador perde imediatamente quando clicar em qualquer botão Idle que não faça parte da sequência (ou seja, um botão cinza/neutro que não estava sorteado).

O botão clicado incorretamente assume o estado Wrong.

Não será necessário pressionar "Enviar".

O Game Over acontece instantaneamente.

---

# 12. Enviar

O botão Enviar inicia desabilitado.

Ele será habilitado somente quando:

```text
Quantidade de botões em estado Selected

==

Quantidade de botões da sequência
```

---

# 13. Validação

Ao clicar em Enviar:

Se todos os botões corretos foram selecionados:

Rodada concluída.

Caso contrário:

Não deverá ser possível chegar nesta situação (o Enviar só habilita quando a condição da seção 12 é satisfeita).

---

# 14. Progressão

Ao concluir uma rodada:

Se rodada < 5

↓

Rodada++

Caso contrário

↓

Nível++

↓

Rodada = 1

---

# 15. Vitória

O jogador vence quando concluir:

```text
Nível 12

Rodada 5
```

---

# 16. Game Over

Ao perder:

Interromper timer.

Exibir:

- progresso (nível.rodada)
- tempo
- distância
- recorde

Não revelar a sequência completa correta — o jogo é de velocidade/concentração, não de aprendizado de memória. Apenas o botão clicado incorretamente assume o estado Wrong (ver seção 8).

Permitir reiniciar.

---

# 17. Distância

A distância representa quanto falta para concluir o jogo.

Exemplos

| Progresso | Distância |
|------------|-----------|
|1.1|11 níveis e 4 rodadas|
|3.2|9 níveis e 3 rodadas|
|5.5|7 níveis|
|9.4|3 níveis e 1 rodada|
|9.5|3 níveis|
|11.5|1 nível|
|12|Concluído|

---

# 18. Timer

O timer:

- inicia ao final do countdown de preparação (Ready), antes da primeira sequência ser exibida
- nunca reinicia entre rodadas
- encerra apenas em:
    - vitória
    - derrota

---

# 19. Recorde e Persistência de Sessão

O recorde é composto por:

- maior progresso

Em caso de empate:

- menor tempo

Persistido em LocalStorage.

**Persistência de sessão em andamento:** não existe. Uma partida em progresso não é salva — caso o jogador atualize a página ou saia, a partida é perdida e uma nova partida deve começar do zero (Nível 1, Rodada 1). Apenas o recorde histórico sobrevive entre sessões.

---

# 20. Máquina de Estados

```text
Idle

↓

Ready (countdown de preparação, apenas na 1ª rodada da partida)

↓

ShowingSequence

↓

WaitingInput

↓

ReadyToSubmit

↓

Validating

↓

RoundCompleted

↓

NextRound

↓

NextLevel

↓

Victory

ou

↓

GameOver
```

**Ready:** duração fixa de ~1.5s, exibindo contagem regressiva (ex: "3, 2, 1"). Ocorre apenas uma vez, no início da partida — rodadas subsequentes vão direto de `RoundCompleted`/`NextRound` para `ShowingSequence`, sem novo countdown.

---

# 21. Invariantes

As seguintes regras nunca podem ser violadas:

- existem exatamente 12 botões de ação (mais o botão Enviar, que não participa do sorteio)
- sequência nunca possui repetição
- botão Selected não pode ser clicado novamente
- botão em estado Showing nunca aceita clique
- botão incorreto (Idle, fora da sequência) encerra a partida
- enviar somente habilita após todos os botões corretos estarem em Selected
- timer nunca reinicia durante a partida
- progresso sempre evolui de forma sequencial
- somente um estado da máquina pode estar ativo por vez
- nenhuma partida em andamento é persistida entre sessões — apenas o recorde
- todo estado visual de botão possui reforço não-cromático (ícone/animação), não dependendo exclusivamente de cor

---

# 22. Critérios de Aceitação

Uma implementação é considerada correta quando:

- respeita todas as regras deste documento
- não permite estados inválidos
- produz comportamento determinístico para qualquer entrada
- mantém sincronização entre UI e Game Engine
- permite cobertura completa por testes unitários
- a paleta de estados dos botões (seção 8) é perceptível para usuários com daltonismo (protanopia/deuteranopia), validado por reforço não-cromático
