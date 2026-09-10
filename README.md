# Reflexo

Jogo de reação feito para a Atividade Prática 1 da disciplina GAC116 – Programação Web (UFLA).

## Objetivo

Clicar nos quadrados que acendem na grade antes que eles apaguem sozinhos, acumulando o maior número possível de pontos em trinta segundos.

## Regras

- Quadrados acendem em posições aleatórias da grade e apagam sozinhos após alguns instantes. A barra na base de cada quadrado indica quanto tempo resta.
- Cada acerto vale 10 pontos, mais 2 pontos por acerto consecutivo na sequência atual.
- Quadrados vermelhos valem o dobro dos pontos e devolvem um dos quadrados já perdidos.
- Deixar um quadrado apagar sozinho conta como perdido e zera a sequência.
- Derrota: cinco quadrados perdidos.
- Vitória: sobreviver aos trinta segundos.
- A dificuldade aumenta ao longo da partida — os quadrados passam a ficar menos tempo acesos e a nascer com menos intervalo entre si.
- O recorde é mantido entre partidas enquanto a página não for recarregada.

## Instalação

Não é necessário instalar nada. Basta abrir o arquivo `index.html` em qualquer navegador, ou acessar a versão publicada.

## Tecnologias utilizadas

HTML, CSS e JavaScript puro, sem bibliotecas, frameworks ou etapa de build.

A lógica do jogo (`js/jogo.js`) é separada da manipulação do DOM (`js/interface.js`).

## Versão publicada

https://petrus012.github.io/reflexo-gac116/

## Licença

MIT — ver arquivo LICENSE.

```json
{
"nome": "Reflexo",
"descricao": "Jogo de reação em que quadrados acendem e apagam sozinhos na grade. Clique antes que apaguem para pontuar, com sequências, alvos especiais e dificuldade crescente ao longo de trinta segundos.",
"autores": "Pyêtro Augusto Malaquias",
"turma": "10A",
}
```