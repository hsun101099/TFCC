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

const TAROT_LIST = [
  { key: '愚者', icon: '🃏' }, { key: '魔術師', icon: '🪄' }, { key: '女祭司', icon: '🌙' },
  { key: '皇后', icon: '👑' }, { key: '皇帝', icon: '🛡️' }, { key: '教皇', icon: '⛪' },
  { key: '戀人', icon: '💞' }, { key: '戰車', icon: '🏎️' }, { key: '力量', icon: '🦁' },
  { key: '隱者', icon: '🏮' }, { key: '命運之輪', icon: '🎡' }, { key: '正義', icon: '⚖️' },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZODIAC_LIST, TAROT_LIST };
}
