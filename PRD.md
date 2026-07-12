# PRD — FlashTap

> **Versão:** 2.1
> **Status:** MVP
> **Produto:** FlashTap
> **Plataforma:** Web
> **Stack:** Next.js + React + TypeScript

---

# 1. Visão do Produto

FlashTap é um jogo de memória e reflexo inspirado em brinquedos eletrônicos de botões luminosos.

O jogo desafia o jogador a memorizar quais botões foram iluminados, reproduzir corretamente essa combinação e fazer isso no menor tempo possível.

Embora inspirado em um brinquedo infantil, o produto é direcionado principalmente para adultos que apreciam jogos rápidos de concentração, memória e reflexo, mantendo uma interface simples e agradável também para crianças.

O foco do MVP é entregar uma experiência extremamente rápida:

- entrar
- jogar
- perder ou vencer
- visualizar o resultado
- tentar novamente

Todo o fluxo deve ocorrer em poucos segundos.

---

# 2. Objetivos do Produto

## Objetivo principal

Criar um jogo casual baseado em memória e reflexo, onde o jogador compete contra seu próprio tempo.

## Objetivos secundários

- Exercitar memória de curto prazo
- Exercitar atenção
- Exercitar reflexo
- Incentivar repetição através da competição com o próprio recorde
- Oferecer partidas rápidas
- Funcionar em qualquer dispositivo

---

# 3. Público-Alvo

## Primário

- Adultos
- Pessoas que gostam de jogos casuais
- Usuários que procuram jogos rápidos
- Pessoas que gostam de desafios de reflexo

## Secundário

- Crianças
- Pais
- Escolas

---

# 4. Objetivos do Jogador

O objetivo do jogador é alcançar o maior progresso possível no menor tempo.

O progresso é representado por:

```
nível.rodada
```

Exemplos:

```
1.1
2.4
5.3
9.5
10
```

O objetivo final é concluir completamente o nível 10.

---

# 5. Regras Gerais

O tabuleiro possui exatamente dez botões.

Cada rodada apresenta uma quantidade de botões vermelhos igual ao nível atual.

Após memorizar os botões, o jogador deve reproduzir exatamente a mesma combinação.

Qualquer erro encerra imediatamente a partida.

---

# 6. Progressão

Cada nível possui exatamente cinco rodadas.

Exemplo:

```
Nível 1

Rodada 1
Rodada 2
Rodada 3
Rodada 4
Rodada 5

↓

Nível 2

Rodada 1
...
Rodada 5
```

Ao concluir as cinco rodadas, o jogador avança automaticamente para o próximo nível.

O nível determina **quantos botões acendem** por rodada (N = nível); a rodada dentro do nível apenas varia o sorteio de quais botões (dentre os 10) serão N, mantendo a repetição de dificuldade constante ao longo das 5 tentativas daquele nível antes de subir.

---

# 7. Objetivo da Rodada

Durante uma rodada:

1. O sistema sorteia N botões (N = nível atual).
2. Os botões ficam vermelhos.
3. O jogador memoriza.
4. Os botões apagam.
5. O jogador reproduz a seleção clicando nos botões.
6. Pressiona "Enviar".
7. A rodada é validada.

---

# 8. Critérios de Vitória

O jogador vence quando concluir:

- Nível 10
- Rodada 5

---

# 9. Critérios de Derrota

A partida termina imediatamente quando:

- clicar em um botão incorreto
- exceder o tempo máximo de resposta (se definido — ver seção 20, RF-17)

---

# 10. Resultado da Partida

Ao terminar uma partida serão exibidos:

- Tempo total
- Progresso alcançado
- Distância até o nível máximo
- Melhor recorde local

Exemplo:

```
Game Over

Tempo

01:32.458

Progresso

5.3

Distância

4 níveis e 2 rodadas

Melhor Recorde

7.4
```

---

# 11. Recorde

O sistema deverá salvar localmente:

- melhor progresso
- menor tempo para aquele progresso

Caso o jogador supere seu recorde, ele será atualizado automaticamente.

Não haverá autenticação.

Não haverá backend.

Os dados serão armazenados em LocalStorage.

---

# 12. Fluxo da Aplicação

```
Home

↓

Jogar

↓

Mostrar sequência

↓

Jogador responde

↓

Enviar

↓

Acertou?

↓

Sim

↓

Próxima rodada

↓

Próximo nível

↓

Vitória

ou

↓

Erro

↓

Game Over

↓

Novo jogo
```

---

# 13. Funcionalidades do MVP

## Home

Exibir:

- Logo
- Botão Jogar
- Melhor Recorde

---

## Jogo

Exibir:

- Nível atual
- Rodada atual
- Tempo
- Painel de 10 botões
- Botão Enviar

---

## Resultado

Exibir:

- Tempo total
- Progresso
- Distância
- Recorde
- Botão Jogar Novamente

---

# 14. Escopo do MVP

## Incluído

- Home
- Jogo
- Timer
- Progressão
- Resultado
- Recorde Local
- Responsividade

## Fora do Escopo

- Login
- Backend
- Banco de Dados
- Ranking Online
- Multiplayer
- Modos Extras
- Temas
- Sons configuráveis
- Configurações avançadas

---

# 15. Stack Tecnológica

## Framework

- Next.js (App Router)

## Linguagem

- TypeScript

## Biblioteca

- React

## UI

- Ant Design

## Ícones

- Lucide React

## Animações

- Framer Motion

---

# 16. Arquitetura

O projeto deverá seguir uma arquitetura simples inspirada em Clean Architecture.

A interface React deverá apenas renderizar componentes.

Toda a lógica do jogo deverá permanecer desacoplada da interface.

Separação proposta:

```
UI

↓

Hooks

↓

Game Engine

↓

Utilities
```

---

# 17. Persistência

Será utilizado exclusivamente:

LocalStorage

Itens persistidos:

- Melhor progresso
- Melhor tempo
- Quantidade de partidas

---

# 18. Responsividade

O projeto deverá ser desenvolvido seguindo Mobile First.

Breakpoints:

- Mobile
- Tablet
- Desktop

Toda funcionalidade deve estar disponível em qualquer tamanho de tela.

---

# 19. Acessibilidade

O sistema deverá:

- funcionar por teclado
- possuir foco visível
- utilizar contraste adequado
- possuir labels acessíveis
- respeitar boas práticas de acessibilidade do Ant Design

---

# 20. Requisitos Funcionais

### RF-01

Exibir um painel contendo exatamente dez botões.

### RF-02

Sortear aleatoriamente os botões de cada rodada.

### RF-03

Exibir os botões sorteados em vermelho.

### RF-04

Ocultar a sequência após o tempo de exibição.

### RF-05

Permitir que o jogador selecione os botões corretos.

### RF-06

Alterar botões corretos para verde.

### RF-07

Desabilitar botões já selecionados corretamente.

### RF-08

Encerrar imediatamente a partida ao clicar em um botão incorreto.

### RF-09

Habilitar o botão "Enviar" apenas quando todos os botões corretos tiverem sido selecionados.

### RF-10

Validar a rodada após o clique em "Enviar".

### RF-11

Avançar automaticamente para a próxima rodada.

### RF-12

Avançar automaticamente para o próximo nível após cinco rodadas concluídas.

### RF-13

Registrar o tempo total da partida.

### RF-14

Salvar recordes localmente.

### RF-15

Exibir tela de Game Over.

### RF-16

Exibir tela de Vitória.

### RF-17 *(a definir)*

Caso exista tempo máximo de resposta por rodada, encerrar a partida automaticamente ao estourá-lo.

---

# 21. Requisitos Não Funcionais

- Mobile First
- Responsivo
- Offline após carregamento
- Sem backend
- Sem banco de dados
- Código em TypeScript Strict
- Proibição de uso de `any`
- Componentização
- Alta performance
- Baixo acoplamento
- Alta coesão

---

# 22. Critérios de Sucesso

O MVP será considerado concluído quando o usuário conseguir:

- acessar a Home
- iniciar uma partida
- jogar até perder ou vencer
- visualizar o tempo
- visualizar o progresso
- visualizar a distância até o objetivo
- visualizar seu recorde
- iniciar uma nova partida sem recarregar a página

---

# 23. Métricas do Produto

O MVP armazenará localmente:

- Quantidade de partidas iniciadas
- Quantidade de partidas concluídas
- Melhor progresso
- Melhor tempo

Não haverá coleta de analytics externos nesta versão.

---

# 24. Casos de Borda a Definir

- Existe tempo máximo de resposta por rodada? Se sim, qual valor e o que acontece ao estourar (RF-17)?
- O tempo de exibição da sequência (memorização) é fixo em todos os níveis ou diminui conforme o nível aumenta?
- Ao clicar em um botão errado (RF-08), a partida encerra mesmo que ainda faltem botões certos por selecionar, ou só é permitido clicar dentro do conjunto correto?
- O usuário pode cancelar/reiniciar uma partida em andamento antes de perder ou vencer?

---

# 25. Roadmap Futuro (Fora do MVP)

Possíveis evoluções futuras:

- Ranking online
- Login
- Compartilhamento de recordes
- Sons configuráveis
- Temas visuais
- Modo Zen
- Modo Hardcore
- Modo Infinito
- Estatísticas avançadas
- PWA
- Multiplayer
- Conquistas (Achievements)
