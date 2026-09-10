const DURACAO = 30;
const MAX_PERDIDOS = 5;
const VIDA_INICIAL = 1400;
const VIDA_MINIMA = 600;
const INTERVALO_INICIAL = 1000;
const INTERVALO_MINIMO = 450;
const CHANCE_ESPECIAL = 0.12;

const estado = {
  fase: 'ocioso',
  pontuacao: 0,
  combo: 0,
  perdidos: 0,
  tempoRestante: DURACAO,
  recorde: 0,
  alvos: []
};

let proximoId = 1;

function dificuldade() {
  const decorrido = DURACAO - estado.tempoRestante;
  const progresso = Math.min(1, decorrido / DURACAO);
  return {
    vida: VIDA_INICIAL - (VIDA_INICIAL - VIDA_MINIMA) * progresso,
    intervalo: INTERVALO_INICIAL - (INTERVALO_INICIAL - INTERVALO_MINIMO) * progresso
  };
}

function posicaoLivre(linhas, colunas) {
  const ocupadas = new Set(estado.alvos.map(a => a.linha + ',' + a.coluna));
  const livres = [];
  for (let l = 0; l < linhas; l++) {
    for (let c = 0; c < colunas; c++) {
      if (!ocupadas.has(l + ',' + c)) livres.push({ linha: l, coluna: c });
    }
  }
  if (livres.length === 0) return null;
  return livres[Math.floor(Math.random() * livres.length)];
}

function acenderAlvo(linhas, colunas, agora) {
  if (estado.fase !== 'jogando') return null;
  const posicao = posicaoLivre(linhas, colunas);
  if (!posicao) return null;
  const alvo = {
    id: proximoId++,
    linha: posicao.linha,
    coluna: posicao.coluna,
    nascidoEm: agora,
    vida: dificuldade().vida,
    especial: Math.random() < CHANCE_ESPECIAL
  };
  estado.alvos.push(alvo);
  return alvo;
}

function acertar(id) {
  if (estado.fase !== 'jogando') return false;
  const indice = estado.alvos.findIndex(a => a.id === id);
  if (indice === -1) return false;

  const alvo = estado.alvos[indice];
  estado.alvos.splice(indice, 1);
  estado.combo++;

  const base = 10 + (estado.combo - 1) * 2;
  if (alvo.especial) {
    estado.pontuacao += base * 2;
    // O alvo especial tambem devolve um dos quadrados ja perdidos.
    if (estado.perdidos > 0) estado.perdidos--;
  } else {
    estado.pontuacao += base;
  }

  return true;
}

function expirarAlvos(agora) {
  const antes = estado.alvos.length;
  estado.alvos = estado.alvos.filter(a => agora - a.nascidoEm < a.vida);
  const escaparam = antes - estado.alvos.length;

  if (escaparam > 0) {
    estado.perdidos += escaparam;
    estado.combo = 0;
    if (estado.perdidos >= MAX_PERDIDOS) {
      estado.fase = 'derrota';
      registrarRecorde();
    }
  }
  return escaparam;
}

function registrarRecorde() {
  if (estado.pontuacao > estado.recorde) {
    estado.recorde = estado.pontuacao;
    return true;
  }
  return false;
}

function passarSegundo() {
  if (estado.fase !== 'jogando') return;
  estado.tempoRestante--;
  if (estado.tempoRestante <= 0) {
    estado.tempoRestante = 0;
    estado.fase = 'vitoria';
    registrarRecorde();
  }
}

function iniciarPartida() {
  estado.fase = 'jogando';
  estado.pontuacao = 0;
  estado.combo = 0;
  estado.perdidos = 0;
  estado.tempoRestante = DURACAO;
  estado.alvos = [];
}

function reiniciar() {
  estado.fase = 'ocioso';
  estado.combo = 0;
  estado.perdidos = 0;
  estado.tempoRestante = DURACAO;
  estado.alvos = [];
}