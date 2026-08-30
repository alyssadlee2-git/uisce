// ─── HAMBURGER ────────────────────────────────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});
function closeMobile() {
  document.getElementById('mobile-menu').classList.remove('open');
}

// ─── MENU TABS ────────────────────────────────────────────────────────────────
document.getElementById('menu-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
});

// ─── RENDER HELPERS ───────────────────────────────────────────────────────────
function priceStr(val) {
  return val ? `₩${(val * 1000).toLocaleString()}` : '—';
}

function menuItemHTML(item) {
  return `
    <div class="menu-item">
      <div class="menu-item-info">
        <div class="menu-item-name">${item.kr} <span class="menu-item-name-en">${item.en || ''}</span></div>
        ${item.desc ? `<div class="menu-item-desc">${item.desc}</div>` : ''}
        ${item.alc ? `<div class="menu-item-alc">${item.alc}</div>` : ''}
      </div>
      <div class="menu-item-price">
        <div class="price-main">${item.price || ''}</div>
      </div>
    </div>`;
}

function whiskeyItemHTML(item) {
  const p60 = item.g60 ? ` / ${priceStr(item.g60)}` : '';
  return `
    <div class="menu-item">
      <div class="menu-item-info">
        <div class="menu-item-name">${item.kr}</div>
        <div class="menu-item-name-en">${item.en}</div>
      </div>
      <div class="menu-item-price">
        <div class="price-main">${priceStr(item.g30)}${p60}</div>
        <div class="price-sub">30ml${item.g60 ? ' / 60ml' : ''}</div>
      </div>
    </div>`;
}

function otherItemHTML(item) {
  if (item.price) return menuItemHTML(item);
  const p60 = item.g60 ? ` / ${priceStr(item.g60)}` : '';
  return `
    <div class="menu-item">
      <div class="menu-item-info">
        <div class="menu-item-name">${item.kr}</div>
        <div class="menu-item-name-en">${item.en}</div>
        ${item.desc ? `<div class="menu-item-desc">${item.desc}</div>` : ''}
      </div>
      <div class="menu-item-price">
        <div class="price-main">${priceStr(item.g30)}${p60}</div>
        <div class="price-sub">30ml${item.g60 ? ' / 60ml' : ''}</div>
      </div>
    </div>`;
}

// ─── RENDER ALL (called after data loads) ────────────────────────────────────
function renderAll() {

// ─── RENDER SIGNATURE ─────────────────────────────────────────────────────────
document.getElementById('render-signature').innerHTML =
  SIGNATURE.map(menuItemHTML).join('');

// ─── RENDER COCKTAIL ──────────────────────────────────────────────────────────
(function renderCocktail() {
  const cats = Object.keys(COCKTAILS);
  const subTabsEl = document.getElementById('cocktail-sub-tabs');
  const renderEl = document.getElementById('render-cocktail');

  subTabsEl.innerHTML = cats.map((c, i) =>
    `<button class="sub-tab-btn${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');

  function show(cat) {
    renderEl.innerHTML = `
      <div class="menu-group">
        <div class="menu-group-title">${cat}</div>
        ${COCKTAILS[cat].map(menuItemHTML).join('')}
        ${cat === 'GIN' ? '<div class="menu-note"># 원하시는 진으로 변경 가능하며, 차액이 추가됩니다.</div>' : ''}
      </div>`;
  }

  show(cats[0]);
  subTabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.sub-tab-btn');
    if (!btn) return;
    subTabsEl.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    show(btn.dataset.cat);
  });
})();

// ─── RENDER WHISKEY ───────────────────────────────────────────────────────────
(function renderWhiskey() {
  const cats = Object.keys(WHISKEY);
  const subTabsEl = document.getElementById('whiskey-sub-tabs');
  const renderEl = document.getElementById('render-whiskey');

  subTabsEl.innerHTML = cats.map((c, i) =>
    `<button class="sub-tab-btn${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');

  function show(cat) {
    renderEl.innerHTML = `
      <div class="menu-group">
        <div class="menu-group-title">${cat} SINGLE MALT</div>
        ${WHISKEY[cat].map(whiskeyItemHTML).join('')}
      </div>`;
  }

  show(cats[0]);
  subTabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.sub-tab-btn');
    if (!btn) return;
    subTabsEl.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    show(btn.dataset.cat);
  });
})();

// ─── RENDER FOOD ──────────────────────────────────────────────────────────────
document.getElementById('render-food').innerHTML =
  Object.entries(FOOD).map(([group, items]) => `
    <div class="menu-group">
      <div class="menu-group-title">${group}</div>
      ${items.map(menuItemHTML).join('')}
    </div>`).join('');

// ─── RENDER TASTING ───────────────────────────────────────────────────────────
document.getElementById('render-tasting').innerHTML =
  TASTING.map(c => `
    <div class="course-card">
      <div class="course-num">${c.num}</div>
      <div class="course-name">${c.name}</div>
      <div class="course-price">${c.price}</div>
      <div class="course-items">${c.items}</div>
      <div class="course-desc">${c.desc}</div>
    </div>`).join('');

// ─── RENDER BOTTLE ────────────────────────────────────────────────────────────
document.getElementById('render-bottle').innerHTML =
  BOTTLE.map(b => `
    <div class="menu-item">
      <div class="menu-item-info">
        <div class="menu-item-name">${b.kr}</div>
        <div class="menu-item-name-en">${b.en}</div>
      </div>
      <div class="menu-item-price"><div class="price-main">${b.price}</div></div>
    </div>`).join('');

// ─── RENDER OTHER ─────────────────────────────────────────────────────────────
(function renderOther() {
  const cats = Object.keys(OTHER);
  const subTabsEl = document.getElementById('other-sub-tabs');
  const renderEl = document.getElementById('render-other');

  subTabsEl.innerHTML = cats.map((c, i) =>
    `<button class="sub-tab-btn${i === 0 ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');

  function show(cat) {
    const items = OTHER[cat];
    renderEl.innerHTML = `
      <div class="menu-group">
        <div class="menu-group-title">${cat}</div>
        ${cat === 'GIN' ? '<div class="menu-note"># 진토닉으로 변경 시 +₩3,000 추가</div>' : ''}
        ${items.map(otherItemHTML).join('')}
      </div>`;
  }

  show(cats[0]);
  subTabsEl.addEventListener('click', e => {
    const btn = e.target.closest('.sub-tab-btn');
    if (!btn) return;
    subTabsEl.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    show(btn.dataset.cat);
  });
})();

} // end renderAll()

// ─── RECOMMENDATION MODE TOGGLE ───────────────────────────────────────────────
document.getElementById('btn-tag-mode').addEventListener('click', () => {
  document.getElementById('btn-tag-mode').classList.add('active');
  document.getElementById('btn-wizard-mode').classList.remove('active');
  document.getElementById('tag-mode').style.display = 'block';
  document.getElementById('wizard').style.display = 'none';
});
document.getElementById('btn-wizard-mode').addEventListener('click', () => {
  document.getElementById('btn-wizard-mode').classList.add('active');
  document.getElementById('btn-tag-mode').classList.remove('active');
  document.getElementById('wizard').style.display = 'block';
  document.getElementById('tag-mode').style.display = 'none';
});

// ─── TAG FILTER ───────────────────────────────────────────────────────────────
const selectedTags = new Set();

document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const t = tag.dataset.tag;
    if (selectedTags.has(t)) { selectedTags.delete(t); tag.classList.remove('selected'); }
    else { selectedTags.add(t); tag.classList.add('selected'); }
    updateTagResults();
  });
});

function getAllTaggableItems() {
  const items = [];
  SIGNATURE.forEach(i => items.push({ name: i.kr, type: '시그니처 칵테일', price: i.price, tags: i.tags }));
  Object.entries(COCKTAILS).forEach(([cat, arr]) =>
    arr.forEach(i => items.push({ name: i.kr, type: `칵테일 — ${cat}`, price: i.price, tags: i.tags }))
  );
  // Add whiskey items with tags
  Object.entries(WHISKEY).forEach(([region, arr]) =>
    arr.forEach(i => items.push({ name: i.kr, type: `위스키 — ${region}`, price: priceStr(i.g30), tags: i.tags }))
  );
  return items;
}

function updateTagResults() {
  const resultsEl = document.getElementById('tag-results');
  const listEl = document.getElementById('tag-results-list');
  if (selectedTags.size === 0) { resultsEl.style.display = 'none'; return; }

  const all = getAllTaggableItems();
  const tags = [...selectedTags];
  const matched = all
    .map(item => ({ ...item, score: tags.filter(t => item.tags.includes(t)).length }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  resultsEl.style.display = 'block';
  if (matched.length === 0) {
    listEl.innerHTML = '<div class="rec-empty">조건에 맞는 메뉴가 없습니다. 태그를 다시 선택해보세요.</div>';
    return;
  }
  listEl.innerHTML = matched.map(item => `
    <div class="rec-item">
      <div class="rec-item-left">
        <div class="name">${item.name}</div>
        <div class="type">${item.type}</div>
      </div>
      <div class="rec-item-price">${item.price}</div>
    </div>`).join('');
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
let wizardHistory = [];

function wizardGo(stepId) {
  const current = document.querySelector('.wizard-step.active');
  if (current) { wizardHistory.push(current.id); current.classList.remove('active'); }
  document.getElementById('ws-' + stepId)?.classList.add('active');
}

function wizardBack(targetId) {
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  document.getElementById(targetId)?.classList.add('active');
}

function wizardReset() {
  wizardHistory = [];
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('ws-0').classList.add('active');
}

const WIZARD_RESULTS = {
  signature: {
    title: '시그니처 추천',
    items: SIGNATURE.map(i => ({ name: i.kr, desc: i.desc }))
  },
  'light-sweet': {
    title: '달콤하고 가볍게',
    items: [
      { name: '베리 요거트', desc: '복분자와 요거트의 새콤달콤한 디저트 칵테일 (Alc. 8–10%)' },
      { name: '망고 오! 망고', desc: '망고 베이스의 상큼한 시그니처 하이볼 (Alc. 8–10%)' },
      { name: '에프리콧 피즈', desc: '살구 리큐르의 달콤한 탄산 칵테일 (Alc. 10–15%)' },
      { name: '아마레또 사워', desc: '아몬드 향의 달콤한 사워 칵테일 (Alc. 20%)' },
    ]
  },
  'light-citrus': {
    title: '상큼하고 가볍게',
    items: [
      { name: '진 리키', desc: '설탕 없이 라임과 탄산이 드라이하게 (Alc. 10–15%)' },
      { name: '칼바도스 소닉', desc: '은은한 사과향의 하이볼 스타일 (Alc. 10–14%)' },
      { name: '다이키리', desc: '럼과 라임의 클래식한 산뜻함 (Alc. 20–25%)' },
      { name: '하이랜드 쿨러', desc: '스카치에 생강과 레몬이 더해진 하이볼 (Alc. 10–15%)' },
    ]
  },
  'light-fizz': {
    title: '탄산있게 가볍게',
    items: [
      { name: '아페롤 피즈', desc: '부드러운 탄산과 시트러스향 (Alc. 10–15%)' },
      { name: '진 피즈', desc: '레몬과 진의 청량한 클래식 (Alc. 12–16%)' },
      { name: '모히또', desc: '민트와 라임의 여름 한 잔 (Alc. 10–15%)' },
      { name: '위스키 하이볼', desc: '위스키와 탄산수만으로 완성 (Alc. 가변)' },
    ]
  },
  'proper-cocktail': {
    title: '클래식 칵테일 추천',
    items: [
      { name: '위스키 사워', desc: '버번과 레몬의 새콤달콤한 입문 칵테일 (Alc. 15–20%)' },
      { name: '맨하탄', desc: '라이 위스키와 베르무트의 우아한 클래식 (Alc. 28%)' },
      { name: '사이드카', desc: '브랜디와 레몬의 황금빛 한 잔 (Alc. 22–30%)' },
      { name: '다이키리', desc: '럼과 라임의 심플하고 완벽한 균형 (Alc. 20–25%)' },
    ]
  },
  'proper-bitter': {
    title: '쌉쌀하고 강렬하게',
    items: [
      { name: '네그로니', desc: '진, 캄파리, 베르무트의 이탈리안 클래식 (Alc. 24–28%)' },
      { name: '드라이 마티니', desc: '가장 간결하고 도회적인 클래식 (Alc. 30–35%)' },
      { name: '아페롤 네그로니', desc: '밸런스 좋은 오렌지향 네그로니 (Alc. 20–25%)' },
      { name: '리볼버', desc: '버번과 커피 리큐르의 스모키 마티니 (Alc. 30–35%)' },
    ]
  },
  'proper-smoky': {
    title: '스모키하게',
    items: [
      { name: '페니실린', desc: '스모키 위스키+생강+꿀+레몬 (Alc. 20–25%)' },
      { name: '초크 앤 스모크', desc: '탈리스커 기주의 스모키 칵테일 (Alc. 40%)' },
      { name: '아드벡 10Y', desc: '아일라 피트의 입문, 강렬한 스모키 위스키' },
      { name: '라프로익 셀렉트', desc: '라프로익의 시그니처 스모키함' },
    ]
  },
  'whiskey-beginner': {
    title: '위스키 입문자 추천',
    items: [
      { name: '히비키 하모니', desc: '일본 블렌디드, 부드럽고 꽃향기 (30ml ₩30,000)' },
      { name: '글렌피딕 12Y', desc: '스페이사이드의 가장 접근하기 좋은 입문주 (30ml ₩16,000)' },
      { name: '달위니 15Y', desc: '달콤하고 부드러운 하이랜드 (30ml ₩23,000)' },
      { name: '탐듀 12Y', desc: '달콤한 셰리 캐스크 스페이사이드 (30ml ₩18,000)' },
      { name: '위스키 사워', desc: '위스키 칵테일 입문으로 가장 좋은 선택 (₩22,000)' },
    ]
  },
  'whiskey-sherry': {
    title: '달콤한 셰리 / 와인 캐스크',
    items: [
      { name: '글렌드로낙 12Y', desc: '헤비 셰리 캐스크의 진한 달콤함 (30ml ₩18,000)' },
      { name: '맥캘란 12Y 셰리 오크', desc: '셰리 오크의 대표주 (30ml ₩27,000)' },
      { name: '글렌알라키 12Y', desc: '빌리 워커의 셰리 캐스크 명가 (30ml ₩23,000)' },
      { name: '아란 포트 캐스크', desc: '포트 와인 캐스크의 과일향 (30ml ₩28,000)' },
    ]
  },
  'whiskey-peated': {
    title: '스모키 피트 위스키',
    items: [
      { name: '아드벡 10Y', desc: '아일라 피트의 입문 (30ml ₩19,000)' },
      { name: '라가불린 16Y', desc: '깊고 복잡한 아일라의 정수 (30ml ₩32,000)' },
      { name: '킬 호만 사닉', desc: '달콤함과 스모키함의 균형 (30ml ₩23,000)' },
      { name: '하이랜드파크 12Y', desc: '스모키와 달콤함이 공존하는 입문용 (30ml ₩18,000)' },
    ]
  },
  'whiskey-fruity': {
    title: '깔끔한 과일향 위스키',
    items: [
      { name: '글렌피딕 15Y', desc: '풍부한 과일향의 스페이사이드 (30ml ₩27,000)' },
      { name: '글렌모렌지 오리지널', desc: '꽃향기와 시트러스의 하이랜드 (30ml ₩19,000)' },
      { name: '발베니 12Y 더블우드', desc: '두 가지 캐스크의 복잡한 과일향 (30ml ₩19,000)' },
      { name: '오반 14Y', desc: '바다 향과 과일향의 하이랜드 (30ml ₩25,000)' },
    ]
  },
  'whiskey-japanese': {
    title: '부드럽고 섬세한 재패니즈',
    items: [
      { name: '히비키 하모니', desc: '꽃향기와 달콤함, 일본 블렌디드의 정수 (30ml ₩30,000)' },
      { name: '닛카 미야기쿄', desc: '과일향과 부드러움 (30ml ₩22,000)' },
      { name: '야마자키 12Y', desc: '다양한 캐스크의 복잡미 (30ml ₩40,000)' },
      { name: '이치로스 몰트 앤 그레인', desc: '독특하고 개성 있는 재패니즈 (30ml ₩36,000)' },
    ]
  },
};

function wizardResult(key) {
  const data = WIZARD_RESULTS[key];
  if (!data) return;
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('wizard-result-title').textContent = data.title;
  document.getElementById('wizard-result-items').innerHTML =
    data.items.map(i => `
      <div class="wizard-result-item">
        <div class="rname">${i.name}</div>
        <div class="rdesc">${i.desc}</div>
      </div>`).join('');
  document.getElementById('ws-result').classList.add('active');
}

// ─── ASYNC INIT ───────────────────────────────────────────────────────────────
(async function init() {
  const loading = document.getElementById('loading');
  loading.style.display = 'flex';
  if (typeof loadMenuFromSheets === 'function') {
    await loadMenuFromSheets();
  }
  loading.style.display = 'none';
  renderAll();
})();
