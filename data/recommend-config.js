/* ══════════════════════════════════════════════
   RECOMMENDED SWEETNESS / ICE — per drink
   Compiled from common 50嵐 customer recommendations found online
   (Dcard, blogs, food media "必喝攻略" articles) plus sensible
   category-based defaults for items not individually covered by
   those write-ups (e.g. pure teas favor less sugar, chewy toppings
   that are pre-soaked in syrup favor less sugar, tart fruit drinks
   favor a touch more sugar to balance). This is a general suggestion,
   not an official 50嵐 standard — feel free to adjust to taste.
   `sweetness` / `ice` values must match the labels in menu-data.js.
══════════════════════════════════════════════ */
const recommendConfig = {
  '50lan': {
    // ⭐ 店長推薦
    '四季春珍波椰':       { sweetness: '半糖', ice: '少冰', note: '三色配料本身已帶甜味，半糖喝起來更順口' },
    '微檸檬綠':           { sweetness: '半糖', ice: '少冰', note: '檸檬偏酸，半糖平衡酸度更好入口' },
    '芒果紅茶':           { sweetness: '半糖', ice: '少冰', note: '芒果風味偏甜，半糖剛剛好' },
    '冰淇淋重焙烏龍拿鐵': { sweetness: '少糖', ice: '正常冰', note: '冰淇淋融化後會增添香甜，少糖更均衡' },
    '旺來綠＋椰果':        { sweetness: '半糖', ice: '少冰', note: '鳳梨果香偏酸，半糖更順口' },
    '荔枝烏龍＋珍珠':      { sweetness: '少糖', ice: '微冰', note: '珍珠本身泡在糖水中，少糖更剛好' },

    // 🍵 找好茶（純茶類）
    '阿薩姆紅茶':   { sweetness: '微糖', ice: '正常冰', note: '純茶類喝原味茶香，微糖剛好' },
    '茉莉綠茶':     { sweetness: '微糖', ice: '正常冰', note: '純茶類，微糖更能凸顯花香' },
    '四季春青茶':   { sweetness: '微糖', ice: '正常冰', note: '經典純茶，微糖最對味' },
    '黃金烏龍':     { sweetness: '微糖', ice: '正常冰', note: '茶香醇厚，微糖即可' },
    '檸檬綠':       { sweetness: '半糖', ice: '少冰', note: '檸檬偏酸，半糖更好入口' },
    '檸檬紅':       { sweetness: '半糖', ice: '少冰' },
    '梅の綠':       { sweetness: '半糖', ice: '少冰' },
    '8冰綠':        { sweetness: '微糖', ice: '微冰', note: '本身已是金桔梅醬調味的酸甜口味，微糖微冰最對味' },
    '桔子綠':       { sweetness: '半糖', ice: '少冰' },
    '養樂多綠':     { sweetness: '少糖', ice: '少冰', note: '養樂多本身已偏甜偏酸' },
    '鮮柚綠':       { sweetness: '半糖', ice: '少冰' },
    '旺來紅':       { sweetness: '半糖', ice: '少冰' },
    '旺來綠':       { sweetness: '半糖', ice: '少冰' },
    '柚子烏龍':     { sweetness: '半糖', ice: '少冰' },
    '柚子紅':       { sweetness: '半糖', ice: '少冰' },
    '柚子綠':       { sweetness: '半糖', ice: '少冰' },
    '柚子青':       { sweetness: '半糖', ice: '少冰' },
    '麵茶綠':       { sweetness: '少糖', ice: '正常冰', note: '麵茶香氣濃郁帶甜，少糖更平衡' },
    '麵茶紅':       { sweetness: '少糖', ice: '正常冰' },
    '麵茶青':       { sweetness: '少糖', ice: '正常冰' },
    '麵茶烏龍':     { sweetness: '少糖', ice: '正常冰' },

    // 🥛 找奶茶
    '奶茶':         { sweetness: '半糖', ice: '正常冰' },
    '奶綠':         { sweetness: '半糖', ice: '正常冰' },
    '紅茶瑪奇朵':   { sweetness: '半糖', ice: '正常冰' },
    '綠茶瑪奇朵':   { sweetness: '半糖', ice: '正常冰' },
    '四季瑪奇朵':   { sweetness: '半糖', ice: '正常冰' },
    '烏龍瑪奇朵':   { sweetness: '半糖', ice: '正常冰' },
    '四季奶青':     { sweetness: '微糖', ice: '去冰', note: '網路上很多人推薦去冰微糖加珍珠，奶香更濃郁' },
    '黃金烏龍奶':   { sweetness: '半糖', ice: '正常冰' },
    '阿華田':       { sweetness: '少糖', ice: '正常冰', note: '阿華田本身濃郁香甜，少糖更剛好' },
    '麵茶奶綠':     { sweetness: '少糖', ice: '正常冰' },
    '麵茶奶茶':     { sweetness: '少糖', ice: '正常冰' },
    '麵茶四季奶青': { sweetness: '少糖', ice: '正常冰' },
    '麵茶黃金烏龍奶': { sweetness: '少糖', ice: '正常冰' },

    // 🧋 找口感（波霸／珍珠／布丁）
    '波霸紅茶':     { sweetness: '少糖', ice: '微冰', note: '波霸本身已泡在糖水中，少糖更剛好' },
    '波霸綠茶':     { sweetness: '少糖', ice: '微冰' },
    '波霸青茶':     { sweetness: '少糖', ice: '微冰' },
    '波霸烏龍茶':   { sweetness: '少糖', ice: '微冰' },
    '波霸奶茶':     { sweetness: '1分甜', ice: '微冰', note: '網路上很多老顧客推薦1分糖、微冰，波霸甜度已經很夠' },
    '波霸奶綠':     { sweetness: '1分甜', ice: '微冰' },
    '珍珠紅茶':     { sweetness: '少糖', ice: '微冰' },
    '珍珠綠茶':     { sweetness: '少糖', ice: '微冰' },
    '珍珠青茶':     { sweetness: '少糖', ice: '微冰' },
    '珍珠黃金烏龍': { sweetness: '少糖', ice: '微冰' },
    '珍珠奶茶':     { sweetness: '少糖', ice: '正常冰', note: '經典基本款，少糖喝起來更均衡' },
    '椰果奶茶':     { sweetness: '半糖', ice: '正常冰', note: '椰果本身清爽不甜，半糖才夠味' },
    '布丁奶茶':     { sweetness: '少糖', ice: '正常冰', note: '布丁本身偏甜，少糖剛好' },
    '布丁奶綠':     { sweetness: '少糖', ice: '正常冰' },
    '布丁奶青':     { sweetness: '少糖', ice: '正常冰' },
    '布丁烏龍奶茶': { sweetness: '少糖', ice: '正常冰' },
    '布丁紅':       { sweetness: '少糖', ice: '正常冰' },
    '布丁綠':       { sweetness: '少糖', ice: '正常冰' },
    '布丁青':       { sweetness: '少糖', ice: '正常冰' },
    '布丁黃金烏龍': { sweetness: '少糖', ice: '正常冰' },

    // ☕ 紅茶拿鐵
    '紅茶拿鐵':     { sweetness: '半糖', ice: '正常冰' },
    '綠茶拿鐵':     { sweetness: '半糖', ice: '正常冰' },
    '黃金烏龍拿鐵': { sweetness: '半糖', ice: '正常冰' },
    '阿華田拿鐵':   { sweetness: '少糖', ice: '正常冰' },
    '珍珠鮮奶':     { sweetness: '少糖', ice: '微冰', note: '珍珠已帶甜味，少糖更剛好' },
    '波霸鮮奶':     { sweetness: '少糖', ice: '微冰' },
    '重焙烏龍拿鐵': { sweetness: '半糖', ice: '正常冰', note: '重焙茶香較濃，半糖能中和苦韻' },
    '麵茶綠茶拿鐵':       { sweetness: '少糖', ice: '正常冰' },
    '麵茶紅茶拿鐵':       { sweetness: '少糖', ice: '正常冰' },
    '麵茶黃金烏龍拿鐵':   { sweetness: '少糖', ice: '正常冰' },
    '麵茶重焙烏龍拿鐵':   { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋麵茶綠茶拿鐵':     { sweetness: '少糖', ice: '正常冰', note: '冰淇淋融化後更香甜，少糖剛剛好' },
    '冰淇淋麵茶紅茶拿鐵':     { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋麵茶四季拿鐵':     { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋麵茶黃金烏龍拿鐵': { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋麵茶重焙烏龍拿鐵': { sweetness: '少糖', ice: '正常冰' },

    // 🍋 找新鮮
    '8冰茶':       { sweetness: '微糖', ice: '微冰', note: '清爽消暑款，微糖微冰最對味' },
    '檸檬汁':       { sweetness: '半糖', ice: '少冰', note: '檸檬原汁偏酸，半糖更好入口' },
    '金桔檸檬':     { sweetness: '半糖', ice: '少冰' },
    '檸檬梅汁':     { sweetness: '半糖', ice: '少冰' },
    '檸檬養樂多':   { sweetness: '少糖', ice: '少冰', note: '養樂多本身已偏甜偏酸' },
    '葡萄柚多多':   { sweetness: '少糖', ice: '少冰' },
    '柚子茶':       { sweetness: '半糖', ice: '少冰' },
    '鮮柚汁':       { sweetness: '半糖', ice: '少冰' },

    // 🍦 找冰淇淋
    '芒果紅':       { sweetness: '半糖', ice: '少冰' },
    '芒果綠':       { sweetness: '半糖', ice: '少冰' },
    '芒果青':       { sweetness: '半糖', ice: '少冰' },
    '芒果烏龍':     { sweetness: '半糖', ice: '少冰' },
    '荔枝紅':       { sweetness: '半糖', ice: '少冰' },
    '荔枝綠':       { sweetness: '半糖', ice: '少冰' },
    '荔枝青':       { sweetness: '半糖', ice: '少冰' },
    '荔枝烏龍':     { sweetness: '半糖', ice: '少冰' },
    '冰淇淋紅茶':   { sweetness: '少糖', ice: '正常冰', note: '冰淇淋融化後自然香甜，少糖更剛好' },
    '冰淇淋綠茶':   { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋青茶':   { sweetness: '少糖', ice: '正常冰' },
    '冰淇淋烏龍茶': { sweetness: '少糖', ice: '正常冰' },
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { recommendConfig };
}
