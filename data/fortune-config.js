/* ══════════════════════════════════════════════
   FORTUNE CONFIG — the fixed list of zodiac signs & tarot archetypes
   used by both the browser app (script.js) and the Node.js daily
   generation script (scripts/generate-fortune.js), so the keys the
   AI is asked to fill in always match what the UI expects.
══════════════════════════════════════════════ */
const ZODIAC_LIST = [
  { key: '牡羊座', icon: '♈' }, { key: '金牛座', icon: '♉' }, { key: '雙子座', icon: '♊' },
  { key: '巨蟹座', icon: '♋' }, { key: '獅子座', icon: '♌' }, { key: '處女座', icon: '♍' },
  { key: '天秤座', icon: '♎' }, { key: '天蠍座', icon: '♏' }, { key: '射手座', icon: '♐' },
  { key: '摩羯座', icon: '♑' }, { key: '水瓶座', icon: '♒' }, { key: '雙魚座', icon: '♓' },
];

// traits: each card's "flavor energy" used to score drinks for the 3-card combo
// draw (see script.js scoreDrinksForCards) — tags are classic / milky / fruity /
// fresh / indulgent / comfort / bold.
const TAROT_LIST = [
  { key: '愚者', icon: '🃏', traits: { fresh: 1, fruity: 1 } },
  { key: '魔術師', icon: '🪄', traits: { bold: 1, indulgent: 0.8 } },
  { key: '女祭司', icon: '🌙', traits: { classic: 1, fresh: 0.6 } },
  { key: '皇后', icon: '👑', traits: { milky: 1, indulgent: 1, comfort: 0.6 } },
  { key: '皇帝', icon: '🛡️', traits: { classic: 0.8, milky: 0.8 } },
  { key: '教皇', icon: '⛪', traits: { classic: 1.4 } },
  { key: '戀人', icon: '💞', traits: { fruity: 1, fresh: 0.8 } },
  { key: '戰車', icon: '🏎️', traits: { bold: 1, milky: 0.4 } },
  { key: '力量', icon: '🦁', traits: { comfort: 1, milky: 0.8 } },
  { key: '隱者', icon: '🏮', traits: { classic: 1, fresh: 0.4 } },
  { key: '命運之輪', icon: '🎡', traits: { indulgent: 1, bold: 0.8 } },
  { key: '正義', icon: '⚖️', traits: { classic: 0.8, fresh: 0.8 } },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZODIAC_LIST, TAROT_LIST };
}
