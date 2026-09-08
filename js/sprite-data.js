/* sprite-data.js — the art itself.
   Every sprite is a grid of chars; a palette maps char -> color.
   '.' is always transparent. Rows are padded so ragged art still renders. */

const PALETTE = {
  w: '#ffffff', // white fur
  s: '#e9d9e6', // fur shadow
  k: '#221019', // eyes / features
  p: '#ff9ec9', // blush
  n: '#ff6fae', // nose / tongue
  b: '#c07b4e', // bear fur
  B: '#94572f', // bear fur dark
  m: '#ffd9a8', // bear muzzle
  h: '#ff3d84', // heart
  H: '#ff7cb0', // heart highlight
  t: '#7fd4ff', // tear
};

/* ── sitting kitten, the "before" portrait ─────────────────────── */
const CAT_HAPPY = [
  '........................',
  '......ww........ww......',
  '.....wwww......wwww.....',
  '....wwwwww....wwwwww....',
  '....wwwwwwwwwwwwwwww....',
  '...wwwwwwwwwwwwwwwwww...',
  '..wwwwwwwwwwwwwwwwwwww..',
  '..wwwwwwwwwwwwwwwwwwww..',
  '..wwkkwwwwwwwwwwwwkkww..',
  '..wwkkwwwwwwwwwwwwkkww..',
  '..wppwwwwwwkwwkwwwwppw..',
  '..wwwwwwwwwwnnwwwwwwww..',
  '...wwwwwwwwwwwwwwwwww...',
  '....wwwwwwwwwwwwwwww....',
  '.....wwwwwwwwwwwwww.....',
  '......wwwwwwwwwwww......',
  '.....wwwwwwwwwwwwww.....',
  '....wwwwwwwwwwwwwwww..w.',
  '...wwwwwwwwwwwwwwwwww.ww',
  '...wwwwwwwwwwwwwwwwwwww.',
  '...wwwwwwwwwwwwwwwwwww..',
  '...wwww..wwwwww..wwww...',
  '....ss....ssss....ss....',
  '........................',
];

/* ── same kitten, but you clicked "No" a few too many times ─────── */
const CAT_SAD = [
  '........................',
  '......ww........ww......',
  '.....wwww......wwww.....',
  '....wwwwww....wwwwww....',
  '....wwwwwwwwwwwwwwww....',
  '...wwwwwwwwwwwwwwwwww...',
  '..wwwwwwwwwwwwwwwwwwww..',
  '..wwkkwwwwwwwwwwwwkkww..',
  '..wwkkwwwwwwwwwwwwkkww..',
  '..wwkkwwwwwwwwwwwwkkww..',
  '..wpptwwwwwwwwwwwwppww..',
  '..wwwtwwwwwnnwwwwwwwww..',
  '...wwwwwwwwwwwwwwwwww...',
  '....wwwwwwwwwwwwwwww....',
  '.....wwwwwwwwwwwwww.....',
  '......wwwwwwwwwwww......',
  '.....wwwwwwwwwwwwww.....',
  '....wwwwwwwwwwwwwwww..w.',
  '...wwwwwwwwwwwwwwwwww.ww',
  '...wwwwwwwwwwwwwwwwwwww.',
  '...wwwwwwwwwwwwwwwwwww..',
  '...wwww..wwwwww..wwww...',
  '....ss....ssss....ss....',
  '........................',
];

/* ── the payoff: bear + panda mid-hug, heart overhead.
   Their arms wrap all the way around — the far paw of each shows up on
   the *other* one's outer edge (rows 20-21), which is what sells the hug. */
const HUG = [
  '..............hh..hh............',
  '.............hhhhhhhh...........',
  '.............hHhhhhhh...........',
  '..............hhhhhh............',
  '...............hhhh.............',
  '................hh..............',
  '..BB.......BB....kk.......kk....',
  '.BBBB.....BBBB..kkkk....kkkk....',
  '.BbbB.....BbbB..kkkk....kkkk....',
  '..bbbbbbbbbbbb...wwwwwwwwwww....',
  '.bbbbbbbbbbbbbb.wwwwwwwwwwwww...',
  '.bbbbbbbbbbbbbb.wwwwwwwwwwwww...',
  '.bbkkbbbbbbkkbb.wwkkkwwwkkkww...',
  '.bbkkbbbbbbkkbb.wwkkkwwwkkkww...',
  '.bpbbbmmmmbbbpb.wpwkkwwwkkwpw...',
  '..bbbbmnnmbbbb..wwwwwnnwwwww....',
  '...bbbbmmmbbbb..wwwwwwwwwww.....',
  '...bbbbbbbbbbb....wwwwwwwww.....',
  '..bbbbbbbbbbbbb..wwwwwwwwwww....',
  '.bbbbbbbbbbbbbbbwwwwwwwwwwwww...',
  'wwbbbbbbbbbbbbbbwwwwwwwwwwwwbb..',
  'wwbbbbbbbbbbbbbbwwwwwwwwwwwwbb..',
  '.bbbbbbbbbbbbbbbwwwwwwwwwwwww...',
  '.bbbbbbbbbbbbbbbwwwwwwwwwwwww...',
  '..bbbbbbbbbbbbbbwwwwwwwwwwww....',
  '..bbbb....bbbb...wwww...wwww....',
  '...BB......BB.....ss.....ss.....',
];

/* ── final screen: one big beating heart ───────────────────────── */
const HEART = [
  '.....hhhh....hhhh.....',
  '...hhhhhhh..hhhhhhh...',
  '..hhHHhhhhhhhhhhhhhh..',
  '.hhHHHhhhhhhhhhhhhhhh.',
  '.hhHHhhhhhhhhhhhhhhhh.',
  'hhhHhhhhhhhhhhhhhhhhhh',
  'hhhhhhhhhhhhhhhhhhhhhh',
  'hhhhhhhhhhhhhhhhhhhhhh',
  '.hhhhhhhhhhhhhhhhhhhh.',
  '.hhhhhhhhhhhhhhhhhhhh.',
  '..hhhhhhhhhhhhhhhhhh..',
  '...hhhhhhhhhhhhhhhh...',
  '....hhhhhhhhhhhhhh....',
  '.....hhhhhhhhhhhh.....',
  '......hhhhhhhhhh......',
  '.......hhhhhhhh.......',
  '........hhhhhh........',
  '.........hhhh.........',
  '..........hh..........',
];

const SPRITES = { CAT_HAPPY, CAT_SAD, HUG, HEART };
