/* app.js — screen flow, the escalating "No", celebration. UI lives in the DOM;
   this file only decides *what* state we're in and hands it to the view. */

const $ = (sel) => document.querySelector(sel);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── the escalation script ─────────────────────────────────────── */
const NO_LINES = [
  'melhor clicar no sim...',
  'tem certeza mesmo?? :(',
  'pensa com carinho, vai',
  'assim você me quebra',
  'o botão do não tá encolhendo',
  'agora foi maldade, hein',
  'ele mal se aguenta em pé',
  'eu fiz um site inteiro pra isso',
  'vai, clica no sim logo',
];

// Quanto tempo o botao fica "parado" depois de fugir (ms).
const DODGE_COOLDOWN = 900;

const state = {
  noCount: 0,
  lastDodge: 0,
  screen: 'ask',
  sound: true,
};

/* ── view updates ──────────────────────────────────────────────── */
function showScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.screen === name);
  });
  // Move focus to the panel itself so screen readers land on the new
  // content, without painting a focus ring on a button nobody tabbed to.
  const panel = $(`.screen[data-screen="${name}"]`);
  if (panel) panel.focus({ preventScroll: true });
}

function setHint(text) {
  const hint = $('#hint');
  hint.textContent = text;
  hint.classList.remove('is-new');
  void hint.offsetWidth; // restart the entrance animation
  hint.classList.add('is-new');
}

function paintPortrait(el, spriteName) {
  el.querySelector('.sprite-slot').innerHTML = renderSprite(SPRITES[spriteName]);
}

/* Se existir um arquivo em assets/, ele entra no lugar do pixel art.
   Sem arquivo, o sprite continua la e nada quebra.

   Os nomes com extensao dobrada nao sao gosto: o Windows esconde
   extensoes conhecidas, entao quem renomeia digitando "pergunta.gif"
   num arquivo que ja era .gif termina com "pergunta.gif.gif". Aceitar
   isso custa uma linha e evita o bug que ninguem consegue enxergar
   pelo Explorer. */
function artCandidates(base) {
  const exts = ['gif', 'png', 'webp', 'jpg', 'jpeg'];
  return exts.map((e) => `${base}.${e}`)
    .concat(['gif.gif', 'png.png', 'jpg.jpg'].map((e) => `${base}.${e}`));
}

function loadArt(el, base, list = artCandidates(base), i = 0) {
  if (i >= list.length) return;
  const img = new Image();
  img.onload = () => {
    const slot = el.querySelector('.sprite-slot');
    slot.innerHTML = '';
    img.alt = '';
    slot.appendChild(img);
    // O fundo escuro existe pro gatinho branco do pixel art. Arte de
    // verdade quase sempre vem com fundo claro proprio, entao o quadro
    // acompanha o que esta dentro dele.
    el.classList.add('portrait--light');
  };
  img.onerror = () => loadArt(el, base, list, i + 1);
  img.src = `assets/${list[i]}`;
}

/* ── "No" — the button that never wins ─────────────────────────── */
function onNo() {
  state.noCount++;
  const n = state.noCount;

  document.documentElement.style.setProperty('--yes-scale', String(Math.min(1 + n * 0.26, 2.6)));
  document.documentElement.style.setProperty('--no-scale', String(Math.max(1 - n * 0.11, 0.38)));

  setHint(NO_LINES[Math.min(n - 1, NO_LINES.length - 1)]);

  if (n === 3) {
    paintPortrait($('#ask-portrait'), 'CAT_SAD');
    loadArt($('#ask-portrait'), 'triste');
  }

  const portrait = $('#ask-portrait');
  portrait.classList.remove('shake');
  void portrait.offsetWidth;
  portrait.classList.add('shake');

  Chip.blip(340 - n * 18, 0.12, 'square');

  // From the fourth refusal on, the button starts running away.
  if (n >= 4) {
    $('#no').classList.add('is-dodging');
    dodge();
  }
}

/* O botao e position:fixed enquanto foge, entao isso e coordenada
   absoluta de viewport — nao precisa desfazer o offset anterior. */
function dodge() {
  state.lastDodge = Date.now();
  const btn = $('#no');
  const pad = 18;
  const r = btn.getBoundingClientRect();
  const spanX = Math.max(0, window.innerWidth - r.width - pad * 2);
  const spanY = Math.max(0, window.innerHeight - r.height - pad * 2);

  const yes = $('#yes').getBoundingClientRect();
  const safeGap = Math.max(yes.width, yes.height) * 0.75 + 60;

  let x = pad, y = pad;
  for (let attempt = 0; attempt < 10; attempt++) {
    x = pad + Math.random() * spanX;
    y = pad + Math.random() * spanY;
    const dx = x + r.width / 2 - (yes.left + yes.width / 2);
    const dy = y + r.height / 2 - (yes.top + yes.height / 2);
    const clearOfYes = Math.hypot(dx, dy) > safeGap;
    const clearOfMute = !(x + r.width > window.innerWidth - 80 && y < 80);
    if (clearOfYes && clearOfMute) break;
  }

  btn.style.transform =
    `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px) rotate(${(Math.random() * 24 - 12).toFixed(1)}deg)`;
}

/* ── "Yes" — the payoff ────────────────────────────────────────── */
function onYes() {
  Chip.jingle([[523, 0], [659, 90], [784, 180], [1046, 280]]);
  Confetti.burst(120);
  showScreen('yay');
  if (!reduced) setTimeout(() => Confetti.burst(60), 500);
}

/* ── easter egg: poke the portrait, get a heart ────────────────── */
function pokePortrait(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  Chip.blip(880, 0.06, 'triangle', 0.035);
  setTimeout(() => Chip.blip(1174, 0.08, 'triangle', 0.035), 70);
  Confetti.burst(8);
}

/* ── wiring ────────────────────────────────────────────────────── */
function init() {
  buildScene();
  Confetti.mount($('#confetti'));

  paintPortrait($('#ask-portrait'), 'CAT_HAPPY');
  paintPortrait($('#yay-portrait'), 'HUG');
  loadArt($('#ask-portrait'), 'pergunta');
  loadArt($('#yay-portrait'), 'comemoracao');

  const heart = renderSprite(SPRITES.HEART);
  document.querySelectorAll('.couple__mini, .couple__big')
    .forEach((el) => { el.innerHTML = heart; });

  $('#yes').addEventListener('click', onYes);
  $('#no').addEventListener('click', onNo);
  // Dodge-on-hover only where there is a real cursor. On touch, mouseenter
  // fires just before the tap lands, so the button would become unpressable
  // and the escalation would dead-end.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $('#no').addEventListener('mouseenter', () => {
      // Cooldown: sem isso o botao foge a cada encostada e o clique nunca
      // registra — a pessoa persegue pra sempre e as frases da escalada
      // nunca aparecem. Com a janela de folga ele continua fugindo, mas
      // sempre da pra pegar na segunda tentativa.
      if (state.noCount >= 4 && Date.now() - state.lastDodge > DODGE_COOLDOWN) dodge();
    });
  }

  $('#continue').addEventListener('click', () => {
    Chip.jingle([[659, 0], [880, 110]]);
    showScreen('date');
    Confetti.burst(40);
  });

  $('#replay').addEventListener('click', () => {
    state.noCount = 0;
    document.documentElement.style.setProperty('--yes-scale', '1');
    document.documentElement.style.setProperty('--no-scale', '1');
    const no = $('#no');
    no.classList.remove('is-dodging');
    no.style.transform = '';
    paintPortrait($('#ask-portrait'), 'CAT_HAPPY');
    loadArt($('#ask-portrait'), 'pergunta');
    $('#hint').textContent = '';
    showScreen('ask');
  });

  document.querySelectorAll('.portrait').forEach((el) => {
    el.addEventListener('click', () => pokePortrait(el));
  });

  const soundBtn = $('#sound');
  soundBtn.addEventListener('click', () => {
    state.sound = !state.sound;
    Chip.on = state.sound;
    soundBtn.setAttribute('aria-pressed', String(state.sound));
    soundBtn.textContent = state.sound ? '♪' : '✕';
    Chip.on = state.sound;
    if (state.sound) Chip.blip(784, 0.08);
  });

  showScreen('ask');
}

document.addEventListener('DOMContentLoaded', init);
