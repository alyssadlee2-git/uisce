// ─── 여기에 Google Sheet ID를 입력하세요 ───────────────────────────────────────
// Sheet URL: https://docs.google.com/spreadsheets/d/[여기가 ID]/edit
const SHEET_ID = '';

// ─── 시트 데이터 fetching ─────────────────────────────────────────────────────
async function fetchSheet(name) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  const text = await res.text();
  const raw = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);\s*$/);
  if (!raw) throw new Error(`시트 "${name}" 파싱 실패`);
  const json = JSON.parse(raw[1]);
  const cols = json.table.cols.map(c => c.label);
  return json.table.rows
    .filter(row => row.c && row.c.some(c => c && c.v != null))
    .map(row => {
      const obj = {};
      row.c.forEach((cell, i) => { obj[cols[i]] = cell ? cell.v : null; });
      return obj;
    });
}

// ─── 유틸 함수 ────────────────────────────────────────────────────────────────
function parseTags(str) {
  return str ? String(str).split(',').map(s => s.trim()).filter(Boolean) : [];
}
function fmt(n) {
  if (!n && n !== 0) return null;
  return `₩${(Number(n) * 1000).toLocaleString()}`;
}

// ─── 메인 로더 ────────────────────────────────────────────────────────────────
async function loadMenuFromSheets() {
  if (!SHEET_ID) return false;

  try {
    const [sigRows, cockRows, whisRows, foodRows, tastRows, bottRows, othRows] = await Promise.all([
      fetchSheet('SIGNATURE'),
      fetchSheet('COCKTAIL'),
      fetchSheet('WHISKEY'),
      fetchSheet('FOOD'),
      fetchSheet('TASTING'),
      fetchSheet('BOTTLE'),
      fetchSheet('OTHER'),
    ]);

    // SIGNATURE
    window.SIGNATURE = sigRows.map(r => ({
      kr: r['한국어'], en: r['영어'],
      price: fmt(r['가격']),
      desc: r['설명'], alc: r['도수'],
      tags: parseTags(r['태그']),
    }));

    // COCKTAILS
    window.COCKTAILS = {};
    cockRows.forEach(r => {
      const cat = r['카테고리'];
      if (!window.COCKTAILS[cat]) window.COCKTAILS[cat] = [];
      window.COCKTAILS[cat].push({
        kr: r['한국어'], en: r['영어'],
        price: fmt(r['가격']),
        desc: r['설명'], alc: r['도수'],
        tags: parseTags(r['태그']),
      });
    });

    // WHISKEY
    window.WHISKEY = {};
    whisRows.forEach(r => {
      const region = r['지역'];
      if (!window.WHISKEY[region]) window.WHISKEY[region] = [];
      window.WHISKEY[region].push({
        kr: r['한국어'], en: r['영어'],
        g30: r['30ml가격'] ? Number(r['30ml가격']) : null,
        g60: r['60ml가격'] ? Number(r['60ml가격']) : null,
        tags: parseTags(r['태그']),
      });
    });

    // FOOD
    window.FOOD = {};
    foodRows.forEach(r => {
      const sec = r['섹션'];
      if (!window.FOOD[sec]) window.FOOD[sec] = [];
      window.FOOD[sec].push({
        kr: r['한국어'], en: r['영어'],
        price: fmt(r['가격']),
        desc: r['설명'],
      });
    });

    // TASTING
    window.TASTING = tastRows.map(r => ({
      num: r['번호'], name: r['이름'],
      price: fmt(r['가격']),
      items: r['구성'], desc: r['설명'],
    }));

    // BOTTLE
    window.BOTTLE = bottRows.map(r => ({
      kr: r['한국어'], en: r['영어'],
      price: fmt(r['가격']),
    }));

    // OTHER
    window.OTHER = {};
    othRows.forEach(r => {
      const cat = r['카테고리'];
      if (!window.OTHER[cat]) window.OTHER[cat] = [];
      const item = { kr: r['한국어'], en: r['영어'], desc: r['설명'] };
      if (r['30ml가격']) {
        item.g30 = Number(r['30ml가격']);
        item.g60 = r['60ml가격'] ? Number(r['60ml가격']) : null;
      } else {
        item.price = fmt(r['가격']);
      }
      window.OTHER[cat].push(item);
    });

    console.log('✓ Google Sheets에서 메뉴 로딩 완료');
    return true;

  } catch (e) {
    console.warn('Google Sheets 로딩 실패 → 기본 데이터 사용:', e);
    return false;
  }
}
