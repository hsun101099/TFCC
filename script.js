/* ══════════════════════════════════════════════
   FIREBASE
══════════════════════════════════════════════ */
firebase.initializeApp({
  apiKey: "AIzaSyBuJivEh06ahae7vicgJLEpWZNaIcBr0JI",
  authDomain: "drinks-order-43f90.firebaseapp.com",
  projectId: "drinks-order-43f90",
  storageBucket: "drinks-order-43f90.firebasestorage.app",
  messagingSenderId: "748518969039",
  appId: "1:748518969039:web:246244b406cdcc7048f1ba"
});
const db = firebase.firestore();

/* ══════════════════════════════════════════════
   MENU DATA — loaded from data/menu-data.js (single source of truth
   shared with scripts/generate-fortune.js), currently just 50嵐
══════════════════════════════════════════════ */
const SHOP_ID = '50lan';

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function getAvailableSizes(priceStr) {
  const hasM = /M\$/.test(priceStr);
  const hasL = /L\$/.test(priceStr);
  if (!hasM && !hasL) return { M: false, L: true };
  return { M: hasM, L: hasL };
}

function parsePrice(priceStr, size) {
  if (size === 'M') { const m = priceStr.match(/M\$(\d+)/); if (m) return parseInt(m[1]); }
  if (size === 'L') { const l = priceStr.match(/L\$(\d+)/); if (l) return parseInt(l[1]); }
  const any = priceStr.match(/\$(\d+)/);
  return any ? parseInt(any[1]) : 0;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function todaySessionCode() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `tfcc-${SHOP_ID}-${y}${m}${day}`;
}

/* ══════════════════════════════════════════════
   SESSION — one shared order board per shop per day,
   no password needed since this site is single-shop
══════════════════════════════════════════════ */
const session = { code: todaySessionCode(), name: null };

async function ensureSession(code) {
  const ref = db.collection('sessions').doc(code);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({
      createdBy: 'tfcc-app',
      shopId: SHOP_ID,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  return ref;
}

async function initApp() {
  // Always start at the name screen — a shared device shouldn't silently
  // resume as whoever last typed their name, just pre-fill it as a hint.
  const savedName = localStorage.getItem('tfcc_drink_name');
  if (savedName) document.getElementById('nameInput').value = savedName;
  showNameOverlay();
}

function showNameOverlay() {
  document.getElementById('nameOverlay').classList.remove('hidden');
  document.getElementById('sessionBanner').style.display = 'none';
  document.getElementById('joinerSection').style.display = 'none';
}

function enterMain() {
  document.getElementById('nameOverlay').classList.add('hidden');
  document.getElementById('sessionBanner').style.display = '';
  document.getElementById('bannerText').textContent = `👤 ${session.name}`;
  startLiveStats();
  showJoinerView();
}

let statsUnsub = null;
function startLiveStats() {
  if (statsUnsub) statsUnsub();
  statsUnsub = db.collection('sessions').doc(session.code)
    .collection('orders').onSnapshot(snap => {
      const members = new Set();
      let cups = 0, total = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        members.add(data.memberName);
        (data.items || []).forEach(it => { cups += it.qty; total += (it.unitPrice||0) * it.qty; });
      });
      document.getElementById('bannerStats').innerHTML =
        `<span class="stat-chip">${members.size} 人已點</span>` +
        `<span class="stat-chip">${cups} 杯</span>` +
        `<span class="stat-chip">$${total}</span>`;
    });
}

function showJoinerView() {
  const data = menuData[SHOP_ID];
  document.getElementById('joinerSection').style.display = '';
  document.getElementById('joinerShopHero').innerHTML = `
    <div class="joiner-shop-logo" style="background-image:url('${data.logo}')" role="img" aria-label="${data.name}"></div>
    <div class="joiner-shop-name">${data.name}</div>
    <div class="joiner-shop-desc">${data.desc}</div>`;
}

/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
const state = {
  step: 1,
  cart: [],
  pendingItem: null,
};

/* ══════════════════════════════════════════════
   STEP NAVIGATION
══════════════════════════════════════════════ */
function goToStep(n) {
  state.step = n;

  ['panel1','panel2','panel3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.classList.remove('active','prev');
    if (i + 1 === n) el.classList.add('active');
    else if (i + 1 < n) el.classList.add('prev');
  });

  [1,2,3].forEach(i => {
    const si = document.getElementById('si' + i);
    si.classList.remove('active','done');
    if (i === n) si.classList.add('active');
    else if (i < n) si.classList.add('done');
  });

  document.getElementById('fill1').style.width = n >= 2 ? '100%' : '0%';
  document.getElementById('fill2').style.width = n >= 3 ? '100%' : '0%';

  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const cartPill = document.getElementById('cartPill');

  btnBack.style.display = n > 1 ? '' : 'none';

  if (n === 1) {
    btnNext.textContent = '開始點餐 →';
    btnNext.style.display = '';
    cartPill.classList.remove('visible');
  } else if (n === 2) {
    btnNext.style.display = 'none';
    updateCartPill();
  } else if (n === 3) {
    btnNext.style.display = 'none';
    cartPill.classList.remove('visible');
  }
}

/* ══════════════════════════════════════════════
   RENDER — STEP 1: MENU BOARD
══════════════════════════════════════════════ */
function renderStep1() {
  const data = menuData[SHOP_ID];
  const panel = document.getElementById('panel1');

  panel.innerHTML = `
    <div class="menu-board">
      ${data.categories.map(cat => `
        <div class="board-section">
          <div class="board-section-title">${cat.title}</div>
          ${cat.items.map(item => `
            <div class="board-item">
              <span>
                <span class="board-item-name">${item.name}</span>
                ${item.note ? `<span class="board-item-note">・${item.note}</span>` : ''}
              </span>
              <span class="board-item-price">${item.price}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>`;
}

/* ══════════════════════════════════════════════
   RENDER — STEP 2: ITEM SELECTION
══════════════════════════════════════════════ */
function renderStep2() {
  const data = menuData[SHOP_ID];
  const panel = document.getElementById('panel2');

  panel.innerHTML = `
    <div class="cat-chips-wrap" id="catChips">
      ${data.categories.map((cat, i) => `
        <button class="cat-chip ${i === 0 ? 'active' : ''}" data-idx="${i}">${cat.title}</button>`).join('')}
    </div>
    <div class="items-list" id="itemsList"></div>`;

  renderCategoryItems(0);

  panel.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      panel.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderCategoryItems(parseInt(chip.dataset.idx));
    });
  });
}

function renderCategoryItems(catIdx) {
  const data = menuData[SHOP_ID];
  const list = document.getElementById('itemsList');
  list.innerHTML = data.categories[catIdx].items.map(item => `
    <div class="item-card">
      <div class="item-card-info">
        <div class="item-card-name">${item.name}</div>
        ${item.note ? `<div class="item-card-note">${item.note}</div>` : ''}
      </div>
      <div class="item-card-right">
        <div class="item-card-price">${item.price}</div>
        <button class="add-btn" data-name="${item.name}" data-note="${item.note}" data-price="${item.price}">＋</button>
      </div>
    </div>`).join('');

  list.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pendingItem = {
        name: btn.dataset.name, note: btn.dataset.note, price: btn.dataset.price,
        isTea: !!data.categories[catIdx].teaOnly,
      };
      renderStep3();
      goToStep(3);
    });
  });
}

/* ══════════════════════════════════════════════
   RENDER — STEP 3: CUSTOMIZATION
══════════════════════════════════════════════ */
function renderStep3() {
  const data = menuData[SHOP_ID];
  const item = state.pendingItem;
  const panel = document.getElementById('panel3');
  const sizes = getAvailableSizes(item.price);
  const defaultSize = sizes.L ? 'L' : 'M';
  const hasToppings = data.toppings && data.toppings.length > 0;
  const rec = recommendConfig[SHOP_ID] && recommendConfig[SHOP_ID][item.name];

  panel.innerHTML = `
    <div class="customize-wrap">

      <div class="customize-item-hero">
        <div>
          <div class="customize-item-name">${item.name}</div>
          ${item.note ? `<div style="font-size:0.73rem;color:var(--text-light);margin-top:3px">${item.note}</div>` : ''}
        </div>
        <div class="customize-item-price">${item.price}</div>
      </div>

      ${rec ? `
      <div class="rec-box">
        <div class="rec-box-label">💡 網路推薦喝法</div>
        <div class="rec-box-value">${rec.sweetness}・${rec.ice}</div>
        ${rec.note ? `<div class="rec-box-note">${rec.note}</div>` : ''}
        <button class="rec-apply-btn" id="applyRecBtn">一鍵套用推薦</button>
      </div>` : ''}

      <div class="customize-section">
        <label class="customize-label">🥤 杯型</label>
        <div class="size-toggle">
          <button class="size-btn${!sizes.M ? ' disabled' : ''}${defaultSize === 'M' ? ' selected' : ''}" data-size="M"${!sizes.M ? ' disabled' : ''}>中杯</button>
          <button class="size-btn${!sizes.L ? ' disabled' : ''}${defaultSize === 'L' ? ' selected' : ''}" data-size="L"${!sizes.L ? ' disabled' : ''}>大杯</button>
        </div>
      </div>

      <div class="customize-section">
        <label class="customize-label">🍬 甜度</label>
        <div class="option-pills" id="sweetnessPills">
          ${data.sweetness.map(s => `
            <button class="option-pill" data-val="${s}">${s}</button>
          `).join('')}
        </div>
        <p class="validate-msg" id="sweetMsg">請選擇甜度</p>
      </div>

      <div class="customize-section">
        <label class="customize-label">🧊 冰量</label>
        <div class="option-pills" id="icePills">
          ${data.ice.map(ic => `
            <button class="option-pill" data-val="${ic}">${ic}</button>
          `).join('')}
        </div>
        <p class="validate-msg" id="iceMsg">請選擇冰量</p>
      </div>

      ${hasToppings ? `
      <div class="customize-section">
        <label class="customize-label">➕ 加料（單選一種${item.isTea ? '，純茶類加料需額外收費' : '，珍珠／波霸／椰果及混搭組合免費加！'}）</label>
        <div class="toppings-grid" id="toppingsGrid">
          ${data.toppings.map(t => {
            const price = item.isTea ? t.priceTea : t.priceMilk;
            return `
            <div class="topping-row" data-name="${t.name}" data-price="${price}">
              <div class="topping-row-left">
                <div class="topping-check-icon"></div>
                <span class="topping-name">${t.name}</span>
              </div>
              <span class="topping-price">${price > 0 ? '+$' + price : '免費'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>` : ''}

      <div class="customize-section">
        <label class="customize-label">📝 備註</label>
        <textarea class="notes-input" id="notesInput" placeholder="例：不加冰塊、少甜一點…"></textarea>
      </div>

      <div class="customize-section">
        <label class="customize-label">🔢 數量</label>
        <div class="qty-stepper">
          <button class="qty-btn" id="qtyMinus">－</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" id="qtyPlus">＋</button>
        </div>
      </div>

      <button class="add-to-cart-btn" id="addToCartBtn">加入訂單</button>
    </div>`;

  state.pendingItem = {
    ...item,
    size: defaultSize,
    sweetness: null,
    ice: null,
    toppings: [],
    notes: '',
    qty: 1,
  };

  panel.querySelectorAll('.size-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      panel.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.pendingItem.size = btn.dataset.size;
    });
  });

  panel.querySelectorAll('#sweetnessPills .option-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      panel.querySelectorAll('#sweetnessPills .option-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.pendingItem.sweetness = pill.dataset.val;
    });
  });

  panel.querySelectorAll('#icePills .option-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      panel.querySelectorAll('#icePills .option-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.pendingItem.ice = pill.dataset.val;
    });
  });

  if (rec) {
    panel.querySelector('#applyRecBtn').addEventListener('click', () => {
      const sweetPill = panel.querySelector(`#sweetnessPills .option-pill[data-val="${rec.sweetness}"]`);
      const icePill = panel.querySelector(`#icePills .option-pill[data-val="${rec.ice}"]`);
      if (sweetPill) sweetPill.click();
      if (icePill) icePill.click();
      showToast('已套用推薦甜度冰塊');
    });
  }

  if (hasToppings) {
    // Toppings are single-select — the combo options (混珠/珍波椰/珍椰/波椰)
    // already represent picking multiple QQ toppings together, so there's
    // no need to allow stacking separate picks on top of each other.
    panel.querySelectorAll('.topping-row').forEach(row => {
      row.addEventListener('click', () => {
        const wasChecked = row.classList.contains('checked');
        panel.querySelectorAll('.topping-row').forEach(r => {
          r.classList.remove('checked');
          r.querySelector('.topping-check-icon').textContent = '';
        });
        if (wasChecked) {
          state.pendingItem.toppings = [];
        } else {
          row.classList.add('checked');
          row.querySelector('.topping-check-icon').textContent = '✓';
          state.pendingItem.toppings = [{ name: row.dataset.name, price: parseInt(row.dataset.price) }];
        }
      });
    });
  }

  let qty = 1;
  panel.querySelector('#qtyMinus').addEventListener('click', () => {
    if (qty > 1) { qty--; panel.querySelector('#qtyNum').textContent = qty; state.pendingItem.qty = qty; }
  });
  panel.querySelector('#qtyPlus').addEventListener('click', () => {
    qty++; panel.querySelector('#qtyNum').textContent = qty; state.pendingItem.qty = qty;
  });

  panel.querySelector('#notesInput').addEventListener('input', e => {
    state.pendingItem.notes = e.target.value;
  });

  panel.querySelector('#addToCartBtn').addEventListener('click', () => {
    let valid = true;
    const sPills = panel.querySelector('#sweetnessPills');
    const iPills = panel.querySelector('#icePills');
    const sMsg = panel.querySelector('#sweetMsg');
    const iMsg = panel.querySelector('#iceMsg');

    if (!state.pendingItem.sweetness) {
      valid = false;
      sPills.classList.add('flash'); sMsg.classList.add('show');
      setTimeout(() => sPills.classList.remove('flash'), 400);
    } else { sMsg.classList.remove('show'); }

    if (!state.pendingItem.ice) {
      valid = false;
      iPills.classList.add('flash'); iMsg.classList.add('show');
      setTimeout(() => iPills.classList.remove('flash'), 400);
    } else { iMsg.classList.remove('show'); }

    if (!valid) return;

    const base = parsePrice(state.pendingItem.price, state.pendingItem.size);
    const toppingExtra = state.pendingItem.toppings.reduce((s, t) => s + t.price, 0);
    state.pendingItem.unitPrice = base + toppingExtra;
    state.cart.push({ ...state.pendingItem });
    updateCartPill();
    goToStep(2);
    const btn = panel.querySelector('#addToCartBtn');
    btn.textContent = '✓ 已加入訂單！';
    btn.style.background = 'var(--green)';
    setTimeout(() => { btn.textContent = '加入訂單'; btn.style.background = ''; }, 1200);
  });
}

/* ══════════════════════════════════════════════
   CART
══════════════════════════════════════════════ */
function updateCartPill() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + (i.unitPrice || 0) * i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = total;
  document.getElementById('cartPill').classList.toggle('visible', count > 0);
}

function showSummary() {
  const overlay = document.getElementById('summaryOverlay');
  const itemsEl = document.getElementById('summaryItems');
  const memberRow = document.getElementById('summaryMemberRow');

  memberRow.textContent = `${session.name} 的訂單`;
  memberRow.style.display = '';

  itemsEl.innerHTML = state.cart.map(item => {
    const toppingStr = item.toppings.length ? item.toppings.map(t => t.name).join('、') : '無';
    const lineTotal = (item.unitPrice || 0) * item.qty;
    return `
      <div class="summary-item-row">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-detail">${item.size}｜${item.sweetness}｜${item.ice}｜加料：${toppingStr}</div>
        ${item.notes ? `<div class="summary-item-detail" style="color:var(--brown)">備註：${item.notes}</div>` : ''}
        <div class="summary-item-price-row">
          <span class="summary-item-qty">× ${item.qty}</span>
          <span class="summary-item-price">$${lineTotal}</span>
        </div>
      </div>`;
  }).join('');

  const grandTotal = state.cart.reduce((s, i) => s + (i.unitPrice || 0) * i.qty, 0);
  document.getElementById('summaryTotal').textContent = `$${grandTotal}`;
  overlay.classList.add('open');
}

/* ══════════════════════════════════════════════
   MODAL OPEN / CLOSE
══════════════════════════════════════════════ */
function openShop() {
  const data = menuData[SHOP_ID];
  state.cart = [];
  state.step = 0;

  document.getElementById('modalLogo').src = data.logo;
  document.getElementById('modalLogo').alt = data.name;
  document.getElementById('modalTitle').textContent = data.name;
  document.getElementById('modalDesc').textContent = data.desc;

  renderStep1();
  renderStep2();
  document.getElementById('panel3').innerHTML = '';

  document.getElementById('menuModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  goToStep(1);
}

function closeModal() {
  document.getElementById('menuModal').classList.remove('open');
  document.body.style.overflow = '';
}

function findMenuItem(name) {
  const data = menuData[SHOP_ID];
  for (const cat of data.categories) {
    const item = cat.items.find(i => i.name === name);
    if (item) return { item, isTea: !!cat.teaOnly };
  }
  return null;
}

function openShopAtItem(itemName) {
  const found = findMenuItem(itemName);
  if (!found) { showToast('找不到這個品項，請自行從菜單挑選'); openShop(); return; }
  const data = menuData[SHOP_ID];

  document.getElementById('modalLogo').src = data.logo;
  document.getElementById('modalLogo').alt = data.name;
  document.getElementById('modalTitle').textContent = data.name;
  document.getElementById('modalDesc').textContent = data.desc;
  renderStep1();
  renderStep2();
  document.getElementById('menuModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  state.pendingItem = { name: found.item.name, note: found.item.note, price: found.item.price, isTea: found.isTea };
  renderStep3();
  goToStep(3);
}

/* ══════════════════════════════════════════════
   DAILY DRINK FORTUNE — "今日飲料運勢"
   Recommendations are generated once a day by a real Claude API call
   (see scripts/generate-fortune.js + .github/workflows/daily-fortune.yml)
   and published to data/fortune-today.json.
══════════════════════════════════════════════ */
let fortuneDataCache;
async function loadFortuneData() {
  if (fortuneDataCache !== undefined) return fortuneDataCache;
  try {
    const res = await fetch('data/fortune-today.json', { cache: 'no-store' });
    fortuneDataCache = res.ok ? await res.json() : null;
  } catch (e) {
    fortuneDataCache = null;
  }
  return fortuneDataCache;
}

const fortuneState = { view: 'select' };

async function openFortuneOverlay() {
  fortuneState.view = 'select';
  document.getElementById('fortuneOverlay').classList.add('open');
  await renderFortuneView();
}

function closeFortuneOverlay() {
  document.getElementById('fortuneOverlay').classList.remove('open');
}

async function renderFortuneView() {
  const box = document.getElementById('fortuneBox');

  if (fortuneState.view === 'select') {
    const data = await loadFortuneData();
    if (!data) {
      box.innerHTML = `
        <h2 class="summary-title">🔮 今日飲料運勢</h2>
        <p class="fortune-subtitle">今天的運勢資料還在生成中，請稍後再來看看，或是直接挑選自己喜歡的飲料吧！</p>
        <button class="summary-back-btn" id="fortuneSkipBtn">🧋 直接點餐去</button>`;
      box.querySelector('#fortuneSkipBtn').addEventListener('click', () => { closeFortuneOverlay(); openShop(); });
      return;
    }
    box.innerHTML = `
      <h2 class="summary-title">🔮 今日飲料運勢</h2>
      <p class="fortune-subtitle">讓 Claude AI 幫你算算今天適合喝什麼吧！每天都會重新生成 ✨</p>
      <div class="fortune-mode-grid">
        <button class="fortune-mode-btn" data-mode="zodiac">
          <span class="fortune-mode-icon">♈</span>
          <span><span class="fortune-mode-name">星座占卜</span><br><span class="fortune-mode-desc">選你的星座，看今天適合喝什麼</span></span>
        </button>
        <button class="fortune-mode-btn" data-mode="tarot">
          <span class="fortune-mode-icon">🔮</span>
          <span><span class="fortune-mode-name">抽牌占卜</span><br><span class="fortune-mode-desc">隨機抽一張塔羅牌，揭曉今日運勢</span></span>
        </button>
      </div>
      <button class="fortune-link-btn" id="fortuneSkipBtn">不用了，直接點餐去 →</button>`;
    box.querySelectorAll('.fortune-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fortuneState.view = btn.dataset.mode === 'zodiac' ? 'zodiac' : 'tarot';
        renderFortuneView();
      });
    });
    box.querySelector('#fortuneSkipBtn').addEventListener('click', () => { closeFortuneOverlay(); openShop(); });

  } else if (fortuneState.view === 'zodiac') {
    box.innerHTML = `
      <button class="fortune-link-btn" id="fortuneBackBtn">← 返回</button>
      <h2 class="summary-title">♈ 選擇你的星座</h2>
      <div class="fortune-pick-grid">
        ${ZODIAC_LIST.map(z => `
          <button class="fortune-pick-btn" data-key="${z.key}">
            <div class="fortune-pick-icon">${z.icon}</div>
            <div class="fortune-pick-name">${z.key}</div>
          </button>`).join('')}
      </div>`;
    box.querySelector('#fortuneBackBtn').addEventListener('click', () => { fortuneState.view = 'select'; renderFortuneView(); });
    box.querySelectorAll('.fortune-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => renderFortuneResult('zodiac', btn.dataset.key));
    });

  } else if (fortuneState.view === 'tarot') {
    box.innerHTML = `
      <button class="fortune-link-btn" id="fortuneBackBtn">← 返回</button>
      <h2 class="summary-title">🔮 抽牌占卜</h2>
      <p class="fortune-subtitle">點擊下方卡牌，抽一張屬於今天的塔羅牌</p>
      <button class="fortune-draw-btn" id="fortuneDrawBtn">🎴 點我抽一張牌</button>`;
    box.querySelector('#fortuneBackBtn').addEventListener('click', () => { fortuneState.view = 'select'; renderFortuneView(); });
    box.querySelector('#fortuneDrawBtn').addEventListener('click', () => {
      const card = TAROT_LIST[Math.floor(Math.random() * TAROT_LIST.length)];
      renderFortuneResult('tarot', card.key);
    });
  }
}

async function renderFortuneResult(mode, key) {
  const box = document.getElementById('fortuneBox');
  const data = await loadFortuneData();
  const section = mode === 'zodiac' ? data.zodiac : data.tarot;
  const entry = section && section[key];
  const list = mode === 'zodiac' ? ZODIAC_LIST : TAROT_LIST;
  const icon = (list.find(x => x.key === key) || {}).icon || '✨';

  if (!entry) {
    box.innerHTML = `<p class="fortune-subtitle">這個結果今天還沒準備好，請重新選擇。</p>
      <button class="summary-back-btn" id="fortuneBackBtn">← 重新選擇</button>`;
    box.querySelector('#fortuneBackBtn').addEventListener('click', () => { fortuneState.view = 'select'; renderFortuneView(); });
    return;
  }

  const validDrinks = (entry.drinks || []).map(name => findMenuItem(name)).filter(Boolean)
    .map(r => r.item);

  box.innerHTML = `
    <button class="fortune-link-btn" id="fortuneBackBtn">← 重新選擇</button>
    <div class="fortune-result-hero">
      <div class="fortune-result-icon">${icon}</div>
      <div class="fortune-result-name">${key}</div>
      <div class="fortune-result-text">${entry.fortune}</div>
    </div>
    ${validDrinks.length ? `
      <span class="fortune-rec-label">為你推薦：</span>
      <div class="fortune-rec-list">
        ${validDrinks.map(d => `
          <div class="fortune-rec-card" data-name="${d.name}">
            <span class="fortune-rec-name">${d.name}</span>
            <span class="fortune-rec-price">${d.price}</span>
          </div>`).join('')}
      </div>` : ''}
    <button class="summary-confirm-btn" id="fortuneOrderOwnBtn">🧋 都不喜歡？直接看完整菜單</button>`;

  box.querySelector('#fortuneBackBtn').addEventListener('click', () => { fortuneState.view = 'select'; renderFortuneView(); });
  box.querySelectorAll('.fortune-rec-card').forEach(card => {
    card.addEventListener('click', () => { closeFortuneOverlay(); openShopAtItem(card.dataset.name); });
  });
  box.querySelector('#fortuneOrderOwnBtn').addEventListener('click', () => { closeFortuneOverlay(); openShop(); });
}

/* ══════════════════════════════════════════════
   RANDOM DRINK PICKER — "隨機點飲料"
══════════════════════════════════════════════ */
function getAllMenuItems() {
  const data = menuData[SHOP_ID];
  const seen = new Set();
  const items = [];
  data.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (!seen.has(item.name)) { seen.add(item.name); items.push(item); }
    });
  });
  return items;
}

function pickRandomDrinks(count) {
  const pool = getAllMenuItems();
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const randomState = { view: 'count', count: 0, drinks: [] };

function openRandomOverlay() {
  randomState.view = 'count';
  document.getElementById('randomOverlay').classList.add('open');
  renderRandomView();
}

function closeRandomOverlay() {
  document.getElementById('randomOverlay').classList.remove('open');
}

function renderRandomView() {
  const box = document.getElementById('randomBox');

  if (randomState.view === 'count') {
    box.innerHTML = `
      <h2 class="summary-title">🎲 隨機點飲料</h2>
      <p class="fortune-subtitle">選不出來嗎？讓我們隨機挑幾杯給你參考吧！想看幾杯呢？</p>
      <div class="fortune-pick-grid">
        ${[1, 2, 3, 4, 5].map(n => `
          <button class="fortune-pick-btn" data-count="${n}">
            <div class="fortune-pick-icon">${n}</div>
            <div class="fortune-pick-name">${n} 杯</div>
          </button>`).join('')}
      </div>
      <button class="fortune-link-btn" id="randomSkipBtn">不用了，直接點餐去 →</button>`;
    box.querySelectorAll('.fortune-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = parseInt(btn.dataset.count, 10);
        randomState.count = n;
        randomState.drinks = pickRandomDrinks(n);
        randomState.view = 'result';
        renderRandomView();
      });
    });
    box.querySelector('#randomSkipBtn').addEventListener('click', () => { closeRandomOverlay(); openShop(); });

  } else if (randomState.view === 'result') {
    const drinks = randomState.drinks;
    box.innerHTML = `
      <button class="fortune-link-btn" id="randomBackBtn">← 重新選擇杯數</button>
      <h2 class="summary-title">🎲 隨機選了 ${drinks.length} 杯給你</h2>
      <p class="fortune-subtitle">點一杯直接開始點餐，或是再縮小範圍重新抽！</p>
      <div class="fortune-rec-list">
        ${drinks.map(d => `
          <div class="fortune-rec-card" data-name="${d.name}">
            <span class="fortune-rec-name">${d.name}</span>
            <span class="fortune-rec-price">${d.price}</span>
          </div>`).join('')}
      </div>
      <div class="fortune-actions">
        <button class="random-action-btn" id="randomRerollBtn">🔄 重新抽 ${drinks.length} 杯</button>
        ${drinks.length > 1 ? `<button class="random-action-btn" id="randomNarrowBtn">🎯 還是不知道？少一杯再抽（${drinks.length - 1} 杯）</button>` : ''}
        <button class="summary-confirm-btn" id="randomOrderOwnBtn">🧋 都不喜歡？直接看完整菜單</button>
      </div>`;

    box.querySelector('#randomBackBtn').addEventListener('click', () => { randomState.view = 'count'; renderRandomView(); });
    box.querySelectorAll('.fortune-rec-card').forEach(card => {
      card.addEventListener('click', () => { closeRandomOverlay(); openShopAtItem(card.dataset.name); });
    });
    box.querySelector('#randomRerollBtn').addEventListener('click', () => {
      randomState.drinks = pickRandomDrinks(randomState.count);
      renderRandomView();
    });
    const narrowBtn = box.querySelector('#randomNarrowBtn');
    if (narrowBtn) {
      narrowBtn.addEventListener('click', () => {
        const dropIdx = Math.floor(Math.random() * randomState.drinks.length);
        randomState.drinks = randomState.drinks.filter((_, i) => i !== dropIdx);
        randomState.count = randomState.drinks.length;
        renderRandomView();
      });
    }
    box.querySelector('#randomOrderOwnBtn').addEventListener('click', () => { closeRandomOverlay(); openShop(); });
  }
}

/* ══════════════════════════════════════════════
   ADMIN — hidden reset panel, opened by triple-tapping
   the shop logo on the joiner page. Lets the shop owner
   wipe today's orders to start a fresh round.
══════════════════════════════════════════════ */
const ADMIN_PASSWORD = 'hsun101099';
const adminState = { view: 'password' };

function openAdminOverlay() {
  adminState.view = 'password';
  document.getElementById('adminOverlay').classList.add('open');
  renderAdminView();
}

function closeAdminOverlay() {
  document.getElementById('adminOverlay').classList.remove('open');
}

async function renderAdminView() {
  const box = document.getElementById('adminBox');

  if (adminState.view === 'password') {
    box.innerHTML = `
      <h2 class="summary-title">🔒 管理員模式</h2>
      <p class="fortune-subtitle">請輸入管理密碼以繼續</p>
      <input type="password" class="field-input" id="adminPasswordInput" placeholder="密碼" />
      <button class="summary-confirm-btn" id="adminPasswordSubmit" style="margin-top:14px">確認</button>
      <button class="fortune-link-btn" id="adminCancelBtn">取消</button>`;

    const submit = () => {
      const val = document.getElementById('adminPasswordInput').value;
      if (val === ADMIN_PASSWORD) {
        adminState.view = 'panel';
        renderAdminView();
      } else {
        showToast('密碼錯誤');
      }
    };
    box.querySelector('#adminPasswordSubmit').addEventListener('click', submit);
    box.querySelector('#adminPasswordInput').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    box.querySelector('#adminCancelBtn').addEventListener('click', () => closeAdminOverlay());
    box.querySelector('#adminPasswordInput').focus();

  } else if (adminState.view === 'panel') {
    box.innerHTML = `<h2 class="summary-title">🔒 管理員模式</h2><p class="fortune-subtitle">讀取今日訂單中…</p>`;

    const snap = await db.collection('sessions').doc(session.code).collection('orders').get();
    const members = new Set();
    let cups = 0, total = 0;
    snap.docs.forEach(d => {
      const data = d.data();
      members.add(data.memberName);
      (data.items || []).forEach(it => { cups += it.qty; total += (it.unitPrice || 0) * it.qty; });
    });

    box.innerHTML = `
      <h2 class="summary-title">🔒 管理員模式</h2>
      <div class="admin-stats-box">
        今天目前共有<br>
        👤 ${members.size} 人　🧋 ${cups} 杯　💰 $${total}
      </div>
      <button class="admin-danger-btn" id="adminClearBtn">🗑 清空今天全部訂單</button>
      <button class="fortune-link-btn" id="adminCloseBtn">關閉</button>`;

    box.querySelector('#adminClearBtn').addEventListener('click', async () => {
      if (snap.empty) { showToast('目前沒有訂單'); return; }
      if (!confirm(`確定要刪除今天全部 ${snap.size} 筆訂單嗎？此動作無法復原！`)) return;
      const batch = db.batch();
      snap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      showToast('已清空今天全部訂單');
      closeAdminOverlay();
    });
    box.querySelector('#adminCloseBtn').addEventListener('click', () => closeAdminOverlay());
  }
}

// Long-press (not triple-tap) the shop logo to open admin mode.
// Triple-tap is unreliable on real phones because rapid taps on an
// image commonly get eaten by the browser's double-tap-to-zoom gesture;
// a held press doesn't have that problem.
let logoPressTimer = null;
const joinerHero = document.getElementById('joinerShopHero');

joinerHero.addEventListener('pointerdown', e => {
  if (!e.target.closest('.joiner-shop-logo')) return;
  clearTimeout(logoPressTimer);
  logoPressTimer = setTimeout(() => {
    logoPressTimer = null;
    openAdminOverlay();
  }, 700);
});
['pointerup', 'pointercancel', 'pointerleave'].forEach(evt => {
  joinerHero.addEventListener(evt, () => {
    clearTimeout(logoPressTimer);
    logoPressTimer = null;
  });
});
joinerHero.addEventListener('contextmenu', e => {
  if (e.target.closest('.joiner-shop-logo')) e.preventDefault();
});

document.getElementById('adminOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('adminOverlay')) closeAdminOverlay();
});

/* ══════════════════════════════════════════════
   EVENT LISTENERS — name entry
══════════════════════════════════════════════ */
async function submitName() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) { alert('請輸入你的名字'); return; }
  const btn = document.getElementById('nameSubmitBtn');
  btn.disabled = true; btn.textContent = '處理中…';
  try {
    await ensureSession(session.code);
    session.name = name;
    localStorage.setItem('tfcc_drink_name', name);
    enterMain();
  } catch (e) {
    alert('連線失敗，請稍後再試');
  }
  btn.disabled = false; btn.textContent = '開始點餐 →';
}

document.getElementById('nameSubmitBtn').addEventListener('click', submitName);
document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitName();
});

document.getElementById('changeNameBtn').addEventListener('click', () => {
  if (statsUnsub) { statsUnsub(); statsUnsub = null; }
  localStorage.removeItem('tfcc_drink_name');
  session.name = null;
  document.getElementById('nameInput').value = '';
  showNameOverlay();
});

/* ══════════════════════════════════════════════
   EVENT LISTENERS — ordering flow
══════════════════════════════════════════════ */
document.getElementById('joinerOrderBtn').addEventListener('click', () => openShop());
document.getElementById('joinerFortuneBtn').addEventListener('click', () => openFortuneOverlay());
document.getElementById('joinerRandomBtn').addEventListener('click', () => openRandomOverlay());

document.getElementById('fortuneOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('fortuneOverlay')) closeFortuneOverlay();
});

document.getElementById('randomOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('randomOverlay')) closeRandomOverlay();
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('menuModal').addEventListener('click', e => {
  if (e.target === document.getElementById('menuModal')) closeModal();
});

document.getElementById('btnBack').addEventListener('click', () => {
  if (state.step > 1) goToStep(state.step - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
  if (state.step === 1) goToStep(2);
});

document.getElementById('cartPill').addEventListener('click', () => {
  if (state.cart.length > 0) showSummary();
});

document.getElementById('summaryConfirm').addEventListener('click', async () => {
  const btn = document.getElementById('summaryConfirm');
  btn.disabled = true; btn.textContent = '送出中…';
  try {
    const cleanItems = state.cart.map(it => ({
      name: it.name, size: it.size, sweetness: it.sweetness,
      ice: it.ice, toppings: it.toppings, notes: it.notes || '',
      unitPrice: it.unitPrice || 0, qty: it.qty,
    }));
    await ensureSession(session.code);
    await db.collection('sessions').doc(session.code).collection('orders').add({
      memberName: session.name,
      shopId: SHOP_ID,
      items: cleanItems,
      total: state.cart.reduce((s,i) => s + (i.unitPrice||0)*i.qty, 0),
      time: firebase.firestore.FieldValue.serverTimestamp(),
    });
    alert('✅ 訂單已送出！');
    document.getElementById('summaryOverlay').classList.remove('open');
    closeModal();
    state.cart = [];
  } catch (e) {
    alert('送出失敗，請檢查網路後再試');
  }
  btn.disabled = false; btn.textContent = '確認送出訂單';
});

document.getElementById('summaryBack').addEventListener('click', () => {
  document.getElementById('summaryOverlay').classList.remove('open');
});

/* ══════════════════════════════════════════════
   ORDER MANAGER
══════════════════════════════════════════════ */
let orderUnsub = null;

document.getElementById('orderMgrBtn').addEventListener('click', () => showOrderManager());

function showOrderManager() {
  const content = document.getElementById('orderMgrContent');
  content.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">載入中…</p>';
  document.getElementById('orderMgrOverlay').classList.add('open');

  if (orderUnsub) orderUnsub();
  orderUnsub = db.collection('sessions').doc(session.code)
    .collection('orders').orderBy('time','asc')
    .onSnapshot(snap => {
      renderMembersView(snap);
    }, () => {
      content.innerHTML = '<p style="text-align:center;color:#c0392b;padding:20px">載入失敗</p>';
    });
}

function renderMembersView(snap) {
  const content = document.getElementById('orderMgrContent');
  if (snap.empty) {
    content.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">目前還沒有人送出訂單</p>';
    document.getElementById('orderMgrTotal').textContent = '$0';
    return;
  }
  let grandTotal = 0;
  const grouped = {};
  snap.docs.forEach(doc => {
    const d = doc.data();
    if (!grouped[d.memberName]) grouped[d.memberName] = [];
    grouped[d.memberName].push({ ...d, _id: doc.id });
    grandTotal += d.total || 0;
  });

  content.innerHTML = Object.entries(grouped).map(([member, orders]) =>
    orders.map(order => {
      const isMine = member === session.name;
      return `<div class="order-member-group">
        <div class="order-member-name">
          <span>${member}（$${order.total || 0}）</span>
          ${isMine ? `<button class="delete-order-btn" data-id="${order._id}" data-summary="${(order.items||[]).map(it => `${it.name} ×${it.qty}`).join('、').replace(/"/g, '&quot;')}">刪除</button>` : ''}
        </div>
        ${(order.items||[]).map(it => `
          <div class="order-item-mini">
            <div>
              <div>${it.name} × ${it.qty}</div>
              <div class="order-item-detail">${it.size}｜${it.sweetness}｜${it.ice}${it.toppings?.length ? '｜' + it.toppings.map(t=>t.name).join('、') : ''}</div>
              ${it.notes ? '<div class="order-item-detail">備註：' + it.notes + '</div>' : ''}
            </div>
            <span style="font-weight:600;color:var(--brown)">$${(it.unitPrice||0)*it.qty}</span>
          </div>`).join('')}
      </div>`;
    }).join('')
  ).join('');

  content.querySelectorAll('.delete-order-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const summary = btn.dataset.summary || '這筆訂單';
      if (!confirm(`確定要刪除「${summary}」這杯飲料嗎？`)) return;
      await db.collection('sessions').doc(session.code).collection('orders').doc(btn.dataset.id).delete();
      showToast('已刪除訂單');
    });
  });

  document.getElementById('orderMgrTotal').textContent = `$${grandTotal}`;
}

document.getElementById('orderMgrClose').addEventListener('click', () => {
  document.getElementById('orderMgrOverlay').classList.remove('open');
  if (orderUnsub) { orderUnsub(); orderUnsub = null; }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('summaryOverlay').classList.remove('open');
    document.getElementById('orderMgrOverlay').classList.remove('open');
    document.getElementById('fortuneOverlay').classList.remove('open');
    document.getElementById('randomOverlay').classList.remove('open');
    document.getElementById('adminOverlay').classList.remove('open');
    if (orderUnsub) { orderUnsub(); orderUnsub = null; }
    closeModal();
  }
});

/* ══ INIT ══ */
initApp();
