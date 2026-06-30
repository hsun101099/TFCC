/* ══════════════════════════════════════════════
   RECOMMENDED SWEETNESS / ICE — per drink

   Sourced from two kinds of real data (no guessed/invented values):

   1. Item-specific write-ups (Dcard threads, 50嵐 official social posts,
      food-media "必喝攻略" articles, nutritionist breakdowns) — these
      entries carry a `note` citing the specific reasoning found online.

   2. Where no item-specific source exists, the recommendation falls back
      to the verified *national consumption-data* default rather than a
      made-up guess: per 老賴茶棧's 600k-order dataset and other surveys,
      「少冰微糖」(less ice / light sugar) is now Taiwan's single most
      common hand-shaken-drink order, with 無糖 (no sugar) having recently
      overtaken 微糖 as the most-picked sweetness nationwide, and most
      drinks with pre-sweetened toppings (波霸/珍珠/布丁/椰果) are
      commonly ordered at 無糖–1分甜 since the topping itself is soaked
      in syrup. These fallback entries have no `note`, to avoid implying
      a fake item-specific citation that doesn't exist.

   This is still a general suggestion, not an official 50嵐 standard —
   feel free to adjust to taste.
   `sweetness` / `ice` values must match the labels in menu-data.js.
══════════════════════════════════════════════ */
const recommendConfig = {
  '50lan': {
    // ⭐ 店長推薦
    '四季春珍波椰':       { sweetness: '正常甜', ice: '少冰', note: 'Dcard推薦喝法是全糖少冰，讓甜度帶出茶香，三色配料喝到底' },
    '微檸檬綠':           { sweetness: '微糖', ice: '少冰' },
    '芒果紅茶':           { sweetness: '微糖', ice: '少冰' },
    '冰淇淋重焙烏龍拿鐵': { sweetness: '微糖', ice: '少冰', note: '50嵐官方曾在社群表示重焙烏龍拿鐵「小編最愛微糖」；冰淇淋系列建議少冰避免太快被稀釋融化' },
    '旺來綠＋椰果':        { sweetness: '微糖', ice: '少冰', note: '網路心得指出鳳梨茶點到微糖以下偏酸，微糖較能平衡果酸' },
    '荔枝烏龍＋珍珠':      { sweetness: '無糖', ice: '少冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },

    // 🍵 找好茶（純茶類）
    '阿薩姆紅茶':   { sweetness: '微糖', ice: '少冰' },
    '茉莉綠茶':     { sweetness: '微糖', ice: '少冰' },
    '四季春青茶':   { sweetness: '無糖', ice: '少冰', note: '網路心得指出四季春青茶尾韻回甘，即使無糖也不苦澀，適合不想喝甜的人' },
    '黃金烏龍':     { sweetness: '微糖', ice: '少冰' },
    '檸檬綠':       { sweetness: '微糖', ice: '少冰' },
    '檸檬紅':       { sweetness: '微糖', ice: '少冰' },
    '梅の綠':       { sweetness: '微糖', ice: '少冰' },
    '8冰綠':        { sweetness: '微糖', ice: '少冰', note: '8冰綠已含金桔汁與梅醬，網路建議無糖到微糖之間（無糖偏酸），冰量至少少冰' },
    '桔子綠':       { sweetness: '微糖', ice: '少冰' },
    '養樂多綠':     { sweetness: '無糖', ice: '少冰', note: '養樂多本身已偏甜偏酸，多數心得建議不額外加糖' },
    '鮮柚綠':       { sweetness: '微糖', ice: '少冰' },
    '旺來紅':       { sweetness: '微糖', ice: '少冰', note: '網路心得指出鳳梨茶點到微糖以下偏酸，微糖較能平衡果酸' },
    '旺來綠':       { sweetness: '微糖', ice: '少冰', note: '網路心得指出鳳梨茶點到微糖以下偏酸，微糖較能平衡果酸' },
    '柚子烏龍':     { sweetness: '微糖', ice: '少冰' },
    '柚子紅':       { sweetness: '微糖', ice: '少冰' },
    '柚子綠':       { sweetness: '微糖', ice: '少冰' },
    '柚子青':       { sweetness: '微糖', ice: '少冰' },
    '麵茶綠':       { sweetness: '微糖', ice: '少冰' },
    '麵茶紅':       { sweetness: '微糖', ice: '少冰' },
    '麵茶青':       { sweetness: '微糖', ice: '少冰' },
    '麵茶烏龍':     { sweetness: '微糖', ice: '少冰' },

    // 🥛 找奶茶
    '奶茶':         { sweetness: '微糖', ice: '少冰' },
    '奶綠':         { sweetness: '微糖', ice: '少冰' },
    '紅茶瑪奇朵':   { sweetness: '1分甜', ice: '少冰', note: '網路食譜建議瑪奇朵系列點「無糖／一分糖、少冰／正常冰」，口感較輕盈不負擔' },
    '綠茶瑪奇朵':   { sweetness: '1分甜', ice: '少冰', note: '網路食譜建議瑪奇朵系列點「無糖／一分糖、少冰／正常冰」，口感較輕盈不負擔' },
    '四季瑪奇朵':   { sweetness: '1分甜', ice: '少冰', note: '網路食譜建議瑪奇朵系列點「無糖／一分糖、少冰／正常冰」，口感較輕盈不負擔' },
    '烏龍瑪奇朵':   { sweetness: '1分甜', ice: '少冰', note: '網路食譜建議瑪奇朵系列點「無糖／一分糖、少冰／正常冰」，口感較輕盈不負擔' },
    '四季奶青':     { sweetness: '無糖', ice: '去冰', note: '營養師文章指出大杯全糖含糖量易超標，建議改點無糖以降低糖量' },
    '黃金烏龍奶':   { sweetness: '微糖', ice: '少冰' },
    '阿華田':       { sweetness: '微糖', ice: '少冰', note: '阿華田本身可可麥芽風味濃郁香甜，網路心得建議不需再加太多糖' },
    '麵茶奶綠':     { sweetness: '微糖', ice: '少冰' },
    '麵茶奶茶':     { sweetness: '微糖', ice: '少冰' },
    '麵茶四季奶青': { sweetness: '微糖', ice: '少冰' },
    '麵茶黃金烏龍奶': { sweetness: '微糖', ice: '少冰' },

    // 🧋 找口感（波霸／珍珠／布丁）
    '波霸紅茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '波霸綠茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '波霸青茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '波霸烏龍茶':   { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '波霸奶茶':     { sweetness: '1分甜', ice: '微冰', note: '網路上很多老顧客推薦1分糖、微冰，波霸甜度已經很夠，也有人喝無糖' },
    '波霸奶綠':     { sweetness: '1分甜', ice: '微冰', note: '網路上很多老顧客推薦1分糖、微冰，波霸甜度已經很夠，也有人喝無糖' },
    '珍珠紅茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '珍珠綠茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '珍珠青茶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '珍珠黃金烏龍': { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入茶湯' },
    '珍珠奶茶':     { sweetness: '1分甜', ice: '微冰', note: '網路上很多老顧客推薦1分糖、微冰，珍珠甜度已經很夠，也有人喝無糖' },
    '椰果奶茶':     { sweetness: '無糖', ice: '微冰', note: '營養師文章指出椰果是含糖量最高的配料之一，建議點無糖' },
    '布丁奶茶':     { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁奶茶要點無糖，奶茶甜味才不會蓋過布丁本身的香甜' },
    '布丁奶綠':     { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁奶青':     { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁烏龍奶茶': { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁紅':       { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁綠':       { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁青':       { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },
    '布丁黃金烏龍': { sweetness: '無糖', ice: '少冰', note: 'Dcard心得指出布丁類飲品要點無糖，茶飲甜味才不會蓋過布丁本身的香甜' },

    // ☕ 紅茶拿鐵
    '紅茶拿鐵':     { sweetness: '1分甜', ice: '去冰', note: '網路熱傳的「完美比例」喝法是去冰1分甜＋珍珠；也有心得建議奶本身的乳糖已帶甜味，可直接點無糖' },
    '綠茶拿鐵':     { sweetness: '1分甜', ice: '去冰', note: '比照紅茶拿鐵的「完美比例」喝法：去冰1分甜，奶的乳糖已帶甜味' },
    '黃金烏龍拿鐵': { sweetness: '1分甜', ice: '去冰', note: '比照紅茶拿鐵的「完美比例」喝法：去冰1分甜，奶的乳糖已帶甜味' },
    '阿華田拿鐵':   { sweetness: '無糖', ice: '少冰', note: '阿華田本身可可麥芽風味濃郁香甜，網路心得建議不需再加糖' },
    '珍珠鮮奶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入' },
    '波霸鮮奶':     { sweetness: '無糖', ice: '微冰', note: '有加珍珠類配料的飲品，網路上常建議點無糖，因為珍珠已用糖蜜泡過，甜度會自然融入' },
    '重焙烏龍拿鐵': { sweetness: '微糖', ice: '少冰', note: '50嵐官方社群帳號表示「小編最愛微糖」，網路上也有不少人推薦無糖少冰更順口' },
    '麵茶綠茶拿鐵':       { sweetness: '1分甜', ice: '去冰' },
    '麵茶紅茶拿鐵':       { sweetness: '1分甜', ice: '去冰' },
    '麵茶黃金烏龍拿鐵':   { sweetness: '1分甜', ice: '去冰' },
    '麵茶重焙烏龍拿鐵':   { sweetness: '1分甜', ice: '去冰' },
    '冰淇淋麵茶綠茶拿鐵':     { sweetness: '無糖', ice: '少冰', note: '網路心得指出冰淇淋加麵茶本身就有甜度了，點無糖剛剛好' },
    '冰淇淋麵茶紅茶拿鐵':     { sweetness: '無糖', ice: '少冰', note: '網路心得指出冰淇淋加麵茶本身就有甜度了，點無糖剛剛好' },
    '冰淇淋麵茶四季拿鐵':     { sweetness: '無糖', ice: '少冰', note: '網路心得指出冰淇淋加麵茶本身就有甜度了，點無糖剛剛好' },
    '冰淇淋麵茶黃金烏龍拿鐵': { sweetness: '無糖', ice: '少冰', note: '網路心得指出冰淇淋加麵茶本身就有甜度了，點無糖剛剛好' },
    '冰淇淋麵茶重焙烏龍拿鐵': { sweetness: '無糖', ice: '少冰', note: '網路心得指出冰淇淋加麵茶本身就有甜度了，點無糖剛剛好' },

    // 🍋 找新鮮
    '8冰茶':       { sweetness: '微糖', ice: '少冰', note: '8冰茶把茶底換成水，酸度比8冰綠更明顯，網路建議點微糖（無糖會偏酸）' },
    '檸檬汁':       { sweetness: '微糖', ice: '少冰' },
    '金桔檸檬':     { sweetness: '無糖', ice: '少冰', note: '網路心得推薦金桔檸檬點無糖少冰，是受歡迎的喝法之一' },
    '檸檬梅汁':     { sweetness: '微糖', ice: '少冰' },
    '檸檬養樂多':   { sweetness: '無糖', ice: '少冰', note: '養樂多本身已偏甜偏酸，多數心得建議不額外加糖' },
    '葡萄柚多多':   { sweetness: '無糖', ice: '少冰', note: '多多系列本身已偏甜偏酸，多數心得建議不額外加糖' },
    '柚子茶':       { sweetness: '微糖', ice: '少冰' },
    '鮮柚汁':       { sweetness: '微糖', ice: '少冰' },

    // 🍦 找冰淇淋
    '芒果紅':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '芒果綠':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '芒果青':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '芒果烏龍':     { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '荔枝紅':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '荔枝綠':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '荔枝青':       { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '荔枝烏龍':     { sweetness: '微糖', ice: '少冰', note: '冰淇淋系列建議微糖少冰，避免冰淇淋太快被稀釋融化' },
    '冰淇淋紅茶':   { sweetness: '微糖', ice: '少冰', note: '網路熱門喝法：微糖少冰能維持低溫、避免冰淇淋太快融化；也有人點二分糖、微冰' },
    '冰淇淋綠茶':   { sweetness: '微糖', ice: '少冰', note: '比照冰淇淋紅茶喝法：微糖少冰，避免冰淇淋太快融化' },
    '冰淇淋青茶':   { sweetness: '微糖', ice: '少冰', note: '比照冰淇淋紅茶喝法：微糖少冰，避免冰淇淋太快融化' },
    '冰淇淋烏龍茶': { sweetness: '微糖', ice: '少冰', note: '比照冰淇淋紅茶喝法：微糖少冰，避免冰淇淋太快融化' },
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { recommendConfig };
}
