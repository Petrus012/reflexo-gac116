const LINHAS = 4;
const COLUNAS = 5;

const elTempo       = document.getElementById('tempo');
const elCombo       = document.getElementById('combo');
const elPerdidos    = document.getElementById('perdidos');
const elMaxPerdidos = document.getElementById('maxperdidos');
const elPontos      = document.getElementById('pontos');
const elRecorde     = document.getElementById('recorde');
const elMensagem    = document.getElementById('mensagem');
const elGrade       = document.getElementById('grade');

const btnIniciar   = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');

let idRelogio = null;
let idQuadro = null;
let proximoNascimento = 0;

function montarGrade() {
  elGrade.style.gridTemplateColumns = 'repeat(' + COLUNAS + ', 1fr)';
  elGrade.innerHTML = '';
  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {
      const celula = document.createElement('button');
      celula.className = 'celula';
      celula.dataset.linha = linha;
      celula.dataset.coluna = coluna;

      const barra = document.createElement('span');
      barra.className = 'barra';
      celula.appendChild(barra);

      celula.addEventListener('click', () => {
        const id = celula.dataset.alvo;
        if (id && acertar(Number(id))) desenhar();
      });
      elGrade.appendChild(celula);
    }
  }
}

function desenhar() {
  elTempo.textContent = estado.tempoRestante;
  elCombo.textContent = estado.combo;
  elPerdidos.textContent = estado.perdidos;
  elMaxPerdidos.textContent = MAX_PERDIDOS;
  elPontos.textContent = estado.pontuacao;
  elRecorde.textContent = estado.recorde;

  const acesos = new Map();
  estado.alvos.forEach(a => acesos.set(a.linha + ',' + a.coluna, a));

  elGrade.querySelectorAll('.celula').forEach(celula => {
    const chave = celula.dataset.linha + ',' + celula.dataset.coluna;
    const alvo = acesos.get(chave);
    const barra = celula.querySelector('.barra');

    if (alvo) {
      // So reinicia a animacao quando o alvo daquela celula muda,
      // senao cada redesenho reiniciaria a contagem visual.
      if (celula.dataset.alvo !== String(alvo.id)) {
        celula.dataset.alvo = alvo.id;
        celula.classList.add('aceso');
        celula.classList.toggle('especial', alvo.especial);
        barra.style.transition = 'none';
        barra.style.transform = 'scaleX(1)';
        void barra.offsetWidth;
        barra.style.transition = 'transform ' + alvo.vida + 'ms linear';
        barra.style.transform = 'scaleX(0)';
      }
    } else {
      delete celula.dataset.alvo;
      celula.classList.remove('aceso', 'especial');
      barra.style.transition = 'none';
      barra.style.transform = 'scaleX(0)';
    }

    celula.disabled = estado.fase !== 'jogando';
  });

  btnIniciar.disabled = estado.fase === 'jogando';
  elMensagem.className = 'mensagem';

  if (estado.fase === 'ocioso') {
    elMensagem.textContent = 'Clique em Iniciar para começar.';
  } else if (estado.fase === 'vitoria') {
    elMensagem.textContent = 'Você sobreviveu aos 30 segundos com ' + estado.pontuacao + ' pontos.';
    elMensagem.classList.add('fim');
  } else if (estado.fase === 'derrota') {
    elMensagem.textContent = 'Cinco quadrados perdidos. Fim de jogo com ' + estado.pontuacao + ' pontos.';
    elMensagem.classList.add('fim');
  } else {
    elMensagem.textContent = 'Sequência atual: ' + estado.combo + '.';
  }
}

function quadro() {
  const agora = performance.now();

  if (expirarAlvos(agora) > 0) desenhar();

  if (agora >= proximoNascimento) {
    if (acenderAlvo(LINHAS, COLUNAS, agora)) desenhar();
    proximoNascimento = agora + dificuldade().intervalo;
  }

  if (estado.fase === 'jogando') {
    idQuadro = requestAnimationFrame(quadro);
  } else {
    pararLacos();
    desenhar();
  }
}

function pararLacos() {
  if (idRelogio !== null) { clearInterval(idRelogio); idRelogio = null; }
  if (idQuadro !== null) { cancelAnimationFrame(idQuadro); idQuadro = null; }
}

function comecar() {
  pararLacos();
  iniciarPartida();
  proximoNascimento = performance.now();
  idRelogio = setInterval(() => {
    passarSegundo();
    desenhar();
    if (estado.fase !== 'jogando') pararLacos();
  }, 1000);
  idQuadro = requestAnimationFrame(quadro);
  desenhar();
}

btnIniciar.addEventListener('click', comecar);
btnReiniciar.addEventListener('click', () => {
  pararLacos();
  reiniciar();
  desenhar();
});

montarGrade();
desenhar();