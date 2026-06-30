/* ══════════════════════════════════════════════
   FORTUNE CONFIG — the fixed list of zodiac signs & tarot archetypes
   used by both the browser app (script.js) and the Node.js daily
   generation script (scripts/generate-fortune.js), so the keys the
   AI is asked to fill in always match what the UI expects.
══════════════════════════════════════════════ */
// traits: each zodiac's "flavor personality" — blended into the quiz scoring so
// the same quiz answers yield different drinks for different signs.
// Tags: classic / milky / fruity / fresh / indulgent / comfort / bold
// traits drive zodiac-specific drink scoring inside the quiz (same tag space as
// tarot: classic/milky/fruity/fresh/indulgent/comfort/bold).
// Signs were deliberately made distinct — pairs that felt personality-similar
// still diverge on at least one key axis so they recommend different drinks.
const ZODIAC_LIST = [
  { key: '牡羊座', icon: '♈', traits: { bold: 1.2, fruity: 0.6 } },           // 衝勁+果味
  { key: '金牛座', icon: '♉', traits: { comfort: 1.2, classic: 0.8 } },        // 踏實+暖心
  { key: '雙子座', icon: '♊', traits: { fruity: 1, fresh: 1 } },               // 清新+多變
  { key: '巨蟹座', icon: '♋', traits: { comfort: 1.4, milky: 0.8 } },          // 療癒+包覆感
  { key: '獅子座', icon: '♌', traits: { indulgent: 1.4, bold: 0.6 } },         // 豐盛+有存在感
  { key: '處女座', icon: '♍', traits: { classic: 1.4, fresh: 0.4 } },          // 純粹+精準
  { key: '天秤座', icon: '♎', traits: { fresh: 1, fruity: 0.6, classic: 0.4 } }, // 平衡+清雅
  { key: '天蠍座', icon: '♏', traits: { indulgent: 1, comfort: 1, bold: 0.4 } }, // 深邃+層次
  { key: '射手座', icon: '♐', traits: { fruity: 1.4, fresh: 0.3 } },           // 熱帶+冒險
  { key: '摩羯座', icon: '♑', traits: { classic: 1.2, comfort: 0.6 } },        // 經典+穩健
  { key: '水瓶座', icon: '♒', traits: { bold: 1, indulgent: 0.8, fresh: 0.4 } }, // 獨特+有態度
  { key: '雙魚座', icon: '♓', traits: { comfort: 0.8, fruity: 1, fresh: 0.5 } }, // 夢幻+柔甜
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
