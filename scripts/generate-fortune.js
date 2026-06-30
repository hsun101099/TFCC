#!/usr/bin/env node
/* ══════════════════════════════════════════════
   Daily generator for data/fortune-today.json
   Calls the real Anthropic Messages API once a day (via GitHub Actions,
   see .github/workflows/daily-fortune.yml) so "今日飲料運勢" is genuinely
   fresh content every day, not a canned/algorithmic substitute.

   Requires env var ANTHROPIC_API_KEY.
   Usage: node scripts/generate-fortune.js
══════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const { menuData } = require('../data/menu-data.js');
const { ZODIAC_LIST, TAROT_LIST } = require('../data/fortune-config.js');

const SHOP_ID = '50lan';
const MODEL = 'claude-sonnet-4-6';
const OUT_PATH = path.join(__dirname, '..', 'data', 'fortune-today.json');

function todayTaipei() {
  // Taipei is UTC+8 with no DST — a fixed offset is safe.
  const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function allDrinkNames() {
  const names = [];
  menuData[SHOP_ID].categories.forEach(cat => {
    cat.items.forEach(item => names.push(item.name));
  });
  return names;
}

function buildPrompt(date, drinkNames) {
  const zodiacKeys = ZODIAC_LIST.map(z => z.key);
  const tarotKeys = TAROT_LIST.map(t => t.key);
  return `你是一間台灣手搖飲料店「50嵐」的占卜師兼飲料顧問。今天的日期是 ${date}（台灣時間）。

請針對下列「每一個」星座與塔羅牌，各自創作一段**今天當天**的運勢分析（繁體中文）：

【星座運勢】需要有深度的星座分析風格：
- 約 80～120 字，語氣溫暖有洞察力
- 結合當前行星能量（如水星、金星、火星、木星、土星等）對該星座的影響，寫出這個星座今天的大主題
- 提及該星座的性格特質，以及今天這個能量下特別適合做什麼、要注意什麼
- 語氣像是一位真正懂星盤的朋友在跟你說話，不要太制式或過度正能量，要有真實的洞察

【塔羅牌運勢】保持趣味、簡短風格：
- 約 30～50 字，活潑生動、像朋友在跟你聊天

兩者都要從下面提供的「真實菜單品項清單」中，挑選 4 到 5 杯最適合今天這個運勢/性格的飲料（必須完全照抄清單裡的名稱，不可以自己編造或修改名稱）。

星座清單（必須包含全部 12 個，鍵名請完全照抄）：
${zodiacKeys.join('、')}

塔羅牌清單（必須包含全部 12 個，鍵名請完全照抄）：
${tarotKeys.join('、')}

真實菜單品項清單（只能從這裡面選，不可新增任何不在清單中的名稱）：
${drinkNames.join('、')}

請「只」輸出一個 JSON 物件，不要有任何其他文字、不要用 markdown code fence 包起來，格式必須完全符合：
{
  "date": "${date}",
  "zodiac": {
    "牡羊座": { "fortune": "今天的運勢文字...", "drinks": ["飲料名1", "飲料名2", "飲料名3", "飲料名4"] },
    ... (12 個星座都要有)
  },
  "tarot": {
    "愚者": { "fortune": "今天的運勢文字...", "drinks": ["飲料名1", "飲料名2", "飲料名3", "飲料名4"] },
    ... (12 張塔羅牌都要有)
  }
}`;
}

function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  return JSON.parse(raw);
}

async function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY environment variable');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const text = (data.content || []).map(b => b.text || '').join('');
  return extractJson(text);
}

function sanitizeSection(section, keys, validNames) {
  const out = {};
  keys.forEach(key => {
    const entry = section && section[key];
    const fortune = (entry && typeof entry.fortune === 'string' && entry.fortune.trim())
      ? entry.fortune.trim()
      : '今天的運勢比較神秘，先喝杯喜歡的飲料犒賞自己吧！';
    let drinks = Array.isArray(entry && entry.drinks)
      ? entry.drinks.filter(name => validNames.has(name))
      : [];
    // de-dupe while preserving order
    drinks = [...new Set(drinks)];
    if (drinks.length < 4) {
      const pool = [...validNames].filter(n => !drinks.includes(n));
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      drinks = drinks.concat(pool.slice(0, 4 - drinks.length));
    }
    out[key] = { fortune, drinks: drinks.slice(0, 5) };
  });
  return out;
}

async function main() {
  const date = todayTaipei();
  const drinkNames = allDrinkNames();
  const validNames = new Set(drinkNames);

  const prompt = buildPrompt(date, drinkNames);
  const result = await callClaude(prompt);

  const output = {
    date,
    generatedBy: 'claude-api',
    generatedAt: new Date().toISOString(),
    zodiac: sanitizeSection(result.zodiac, ZODIAC_LIST.map(z => z.key), validNames),
    tarot: sanitizeSection(result.tarot, TAROT_LIST.map(t => t.key), validNames),
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${OUT_PATH} for ${date}`);
}

main().catch(err => {
  console.error('generate-fortune failed:', err.message);
  process.exit(1);
});
