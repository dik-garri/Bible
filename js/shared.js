// Tab navigation
const navInner = document.getElementById('navInner');
const navScroll = document.getElementById('navScroll');

// Hide right fade when scrolled to the end
function checkNavScroll() {
  const atEnd = navInner.scrollLeft + navInner.clientWidth >= navInner.scrollWidth - 5;
  navScroll.classList.toggle('scrolled-end', atEnd);
}
navInner.addEventListener('scroll', checkNavScroll);
window.addEventListener('resize', checkNavScroll);
checkNavScroll();

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
    // Scroll active tab into view
    tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });
});

// Card toggle
function toggleCard(header) {
  const card = header.closest('.card');
  card.classList.toggle('open');
}

// Table sort
let sortDir = {};
function sortTable(colIndex) {
  const table = document.getElementById('compareTable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  sortDir[colIndex] = !sortDir[colIndex];
  const dir = sortDir[colIndex] ? 1 : -1;

  rows.sort((a, b) => {
    const aText = a.cells[colIndex].textContent.trim();
    const bText = b.cells[colIndex].textContent.trim();
    return dir * aText.localeCompare(bText, 'ru');
  });

  rows.forEach(row => tbody.appendChild(row));
}

// ========== PERSON INFO LOOKUP ==========

let personsCache = null;

async function loadPersons() {
  if (personsCache) return personsCache;
  try {
    const resp = await fetch('persons.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    personsCache = await resp.json();
    return personsCache;
  } catch(e) {
    console.error('Failed to load persons.json:', e);
    return null;
  }
}

async function openPersonModal(name) {
  const persons = await loadPersons();
  if (!persons) {
    modalTitle.textContent = name;
    modalBody.innerHTML = '<div class="verse-error">Не удалось загрузить данные</div>';
    showModal();
    return;
  }

  const person = persons[name];
  if (!person) {
    modalTitle.textContent = name;
    modalBody.innerHTML = '<div class="verse-error">Информация не найдена</div>';
    showModal();
    return;
  }

  modalTitle.textContent = name;
  let html = '<div class="person-info">';
  if (person.role) html += `<div class="person-role">${person.role}</div>`;
  if (person.dates) html += `<div class="person-dates">${person.dates}</div>`;
  if (person.bio) html += `<div class="person-bio">${person.bio}</div>`;
  html += '</div>';
  modalBody.innerHTML = html;
  showModal();
}

// ========== LOCATION INFO LOOKUP ==========

let locationsCache = null;

async function loadLocations() {
  if (locationsCache) return locationsCache;
  try {
    const resp = await fetch('locations.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    locationsCache = await resp.json();
    return locationsCache;
  } catch(e) {
    console.error('Failed to load locations.json:', e);
    return null;
  }
}

async function openLocationModal(name) {
  const locations = await loadLocations();
  if (!locations) {
    modalTitle.textContent = name;
    modalBody.innerHTML = '<div class="verse-error">Не удалось загрузить данные</div>';
    showModal();
    return;
  }

  const location = locations[name];
  if (!location) {
    modalTitle.textContent = name;
    modalBody.innerHTML = '<div class="verse-error">Информация не найдена</div>';
    showModal();
    return;
  }

  modalTitle.textContent = name;
  let html = '<div class="location-info">';
  if (location.type) html += `<div class="location-type">${location.type}</div>`;
  if (location.region) html += `<div class="location-region">${location.region}</div>`;
  if (location.desc) html += `<div class="location-desc">${location.desc}</div>`;
  html += '</div>';
  modalBody.innerHTML = html;
  showModal();
}

// ========== BIBLE VERSE LOOKUP ==========

const BOOK_MAP = {
  'Быт': 'gn', 'Бытие': 'gn',
  'Исх': 'ex', 'Исход': 'ex',
  'Лев': 'lv', 'Левит': 'lv',
  'Чис': 'nm', 'Числ': 'nm', 'Числа': 'nm',
  'Втор': 'dt', 'Второзаконие': 'dt',
  'Нав': 'js', 'И.Навин': 'js', 'И. Нав': 'js',
  'Суд': 'jud', 'Судьи': 'jud',
  'Руфь': 'rt',
  '1 Цар': '1sm', '1Цар': '1sm',
  '2 Цар': '2sm', '2Цар': '2sm',
  '3 Цар': '1kgs', '3Цар': '1kgs',
  '4 Цар': '2kgs', '4Цар': '2kgs',
  '1 Пар': '1ch', '2 Пар': '2ch',
  'Езд': 'ezr', 'Неем': 'ne', 'Есф': 'et',
  'Иов': 'job', 'Пс': 'ps', 'Притч': 'prv', 'Еккл': 'ec', 'Песн': 'so',
  'Ис': 'is', 'Исаия': 'is',
  'Иер': 'jr', 'Иеремия': 'jr',
  'Плач': 'lm',
  'Иез': 'ez', 'Иезекииль': 'ez',
  'Дан': 'dn', 'Даниил': 'dn',
  'Ос': 'ho', 'Иоил': 'jl', 'Ам': 'am', 'Авд': 'ob',
  'Ион': 'jn', 'Иона': 'jn',
  'Мих': 'mi', 'Наум': 'na', 'Авв': 'hk', 'Соф': 'zp',
  'Агг': 'hg', 'Зах': 'zc', 'Мал': 'ml',
  'Мф': 'mt', 'Матф': 'mt', 'Мк': 'mk', 'Марк': 'mk',
  'Лк': 'lk', 'Лука': 'lk',
  'Ин': 'jo', 'Иоанн': 'jo',
  'Деян': 'act', 'Деяния': 'act',
  'Рим': 'rm', 'Римлянам': 'rm',
  '1 Кор': '1co', '2 Кор': '2co',
  'Гал': 'gl', 'Еф': 'eph', 'Флп': 'ph', 'Кол': 'cl',
  '1 Фес': '1ts', '2 Фес': '2ts',
  '1 Тим': '1tm', '2 Тим': '2tm',
  'Тит': 'tt', 'Флм': 'phm', 'Евр': 'hb',
  'Иак': 'jm', 'Иакова': 'jm',
  '1 Пет': '1pe', '1 Петра': '1pe', '2 Пет': '2pe', '2 Петра': '2pe',
  '1 Ин': '1jo', '1 Иоанна': '1jo', '2 Ин': '2jo', '3 Ин': '3jo',
  'Иуд': 'jd', 'Иуды': 'jd',
  'Откр': 're', 'Откровение': 're'
};

const BOOK_FULL_NAME = {
  'gn': 'Бытие', 'ex': 'Исход', 'lv': 'Левит', 'nm': 'Числа', 'dt': 'Второзаконие',
  'js': 'И. Навин', 'jud': 'Судьи', 'rt': 'Руфь',
  '1sm': '1 Царств', '2sm': '2 Царств', '1kgs': '3 Царств', '2kgs': '4 Царств',
  '1ch': '1 Паралипоменон', '2ch': '2 Паралипоменон',
  'ezr': 'Ездра', 'ne': 'Неемия', 'et': 'Есфирь',
  'job': 'Иов', 'ps': 'Псалмы', 'prv': 'Притчи', 'ec': 'Екклесиаст', 'so': 'Песнь Песней',
  'is': 'Исаия', 'jr': 'Иеремия', 'lm': 'Плач Иеремии',
  'ez': 'Иезекииль', 'dn': 'Даниил',
  'ho': 'Осия', 'jl': 'Иоиль', 'am': 'Амос', 'ob': 'Авдий',
  'jn': 'Иона', 'mi': 'Михей', 'na': 'Наум', 'hk': 'Аввакум',
  'zp': 'Софония', 'hg': 'Аггей', 'zc': 'Захария', 'ml': 'Малахия',
  'mt': 'Матфей', 'mk': 'Марк', 'lk': 'Лука', 'jo': 'Иоанн',
  'act': 'Деяния', 'rm': 'Римлянам',
  '1co': '1 Коринфянам', '2co': '2 Коринфянам',
  'gl': 'Галатам', 'eph': 'Ефесянам', 'ph': 'Филиппийцам', 'cl': 'Колоссянам',
  '1ts': '1 Фессалоникийцам', '2ts': '2 Фессалоникийцам',
  '1tm': '1 Тимофею', '2tm': '2 Тимофею',
  'tt': 'Титу', 'phm': 'Филимону', 'hb': 'Евреям',
  'jm': 'Иакова', '1pe': '1 Петра', '2pe': '2 Петра',
  '1jo': '1 Иоанна', '2jo': '2 Иоанна', '3jo': '3 Иоанна',
  'jd': 'Иуды', 're': 'Откровение'
};

// Cache for loaded JSON files
const bookCache = {};

async function loadBook(fileId) {
  if (bookCache[fileId]) return bookCache[fileId];
  try {
    const resp = await fetch(`synodal/${fileId}.json`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    bookCache[fileId] = data;
    return data;
  } catch(e) {
    console.error(`Failed to load ${fileId}:`, e);
    return null;
  }
}

// Parse reference text like "Лев. 1:3–9" or "Быт. 22:2, 13–14" or "Лев. 16:3, 6, 11"
// Handles semicolons with book carry-forward, chapter ranges, and comma-separated chapters
function parseRef(text, lastFileId) {
  text = text.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();

  // Handle semicolons — carry book name forward
  if (text.includes(';')) {
    let carry = lastFileId || null;
    const results = [];
    for (const part of text.split(';')) {
      const refs = parseRef(part.trim(), carry);
      if (refs.length > 0) {
        carry = refs[0].fileId;
        results.push(...refs);
      }
    }
    return results;
  }

  text = text.replace(/^ср\.\s*/, '');

  // Try: BookAbbr[.] Chapter:VerseSpec
  const m = text.match(/^(.+?)\s+(\d+):(.+)$/);
  if (m) {
    const bookAbbr = m[1].replace(/\.$/, '').trim();
    const fileId = BOOK_MAP[bookAbbr];
    if (fileId) return [{ fileId, chapter: parseInt(m[2]), verses: parseVerses(m[3].trim()) }];
  }

  // Try just Chapter:Verses with carried-over book
  const mc2 = text.match(/^(\d+):(.+)$/);
  if (mc2 && lastFileId) {
    return [{ fileId: lastFileId, chapter: parseInt(mc2[1]), verses: parseVerses(mc2[2].trim()) }];
  }

  // Try: BookAbbr[.] ChapterSpec (whole chapters, ranges, comma-separated)
  const mch = text.match(/^(.+?)\s+([\d,\s\u2013\u2014\-]+)$/);
  if (mch) {
    const bookAbbr = mch[1].replace(/\.$/, '').trim();
    const fileId = BOOK_MAP[bookAbbr];
    if (fileId) return parseChapters(mch[2].trim(), fileId);
  }

  // Try just chapter(s) with carried-over book
  if (lastFileId && /^[\d,\s\u2013\u2014\-]+$/.test(text)) {
    return parseChapters(text, lastFileId);
  }

  return [];
}

// Parse chapter spec: "22", "4–5", "22, 28–29", "42, 49, 50, 52–53"
function parseChapters(spec, fileId) {
  const results = [];
  for (const part of spec.split(/,\s*/)) {
    const rm = part.trim().match(/^(\d+)\s*[\u2013\u2014\-]\s*(\d+)$/);
    if (rm) {
      for (let ch = parseInt(rm[1]); ch <= parseInt(rm[2]); ch++) results.push({ fileId, chapter: ch, verses: null });
    } else {
      const n = parseInt(part.trim());
      if (!isNaN(n)) results.push({ fileId, chapter: n, verses: null });
    }
  }
  return results;
}

function parseVerses(spec) {
  const verses = [];
  // Split by comma
  const parts = spec.split(/,\s*/);
  for (const part of parts) {
    // Check for range (en-dash, em-dash, or hyphen)
    const rangeMatch = part.match(/^(\d+)\s*[–—\-]\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      for (let i = start; i <= end; i++) verses.push(i);
    } else {
      const num = parseInt(part);
      if (!isNaN(num)) verses.push(num);
    }
  }
  return verses.length > 0 ? verses : null;
}

// Modal elements
const overlay = document.getElementById('verseOverlay');
const modalTitle = document.getElementById('verseModalTitle');
const modalBody = document.getElementById('verseModalBody');
const modalClose = document.getElementById('verseModalClose');

function showModal() { overlay.classList.add('visible'); document.body.style.overflow = 'hidden'; }
function hideModal() { overlay.classList.remove('visible'); document.body.style.overflow = ''; }

modalClose.addEventListener('click', hideModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) hideModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideModal(); });

async function openVerseModal(refText) {
  const refs = parseRef(refText);
  if (refs.length === 0) return;

  // Build title
  const titles = refs.map(r => {
    const name = BOOK_FULL_NAME[r.fileId] || r.fileId;
    if (!r.verses) return `${name} ${r.chapter}`;
    if (r.verses.length === 1) return `${name} ${r.chapter}:${r.verses[0]}`;
    const min = Math.min(...r.verses);
    const max = Math.max(...r.verses);
    // Check if consecutive
    const isConsecutive = r.verses.every((v, i) => i === 0 || v === r.verses[i-1] + 1);
    if (isConsecutive) return `${name} ${r.chapter}:${min}–${max}`;
    return `${name} ${r.chapter}:${r.verses.join(', ')}`;
  });
  modalTitle.textContent = titles.join('; ');
  modalBody.innerHTML = '<div class="verse-loading">Загрузка...</div>';
  showModal();

  let html = '';
  for (const ref of refs) {
    const data = await loadBook(ref.fileId);
    if (!data) {
      html += '<div class="verse-error">Не удалось загрузить книгу</div>';
      continue;
    }
    const chapterData = data[ref.chapter - 1];
    if (!chapterData) {
      html += `<div class="verse-error">Глава ${ref.chapter} не найдена</div>`;
      continue;
    }

    // If multiple refs, add sub-header
    if (refs.length > 1) {
      const name = BOOK_FULL_NAME[ref.fileId] || ref.fileId;
      html += `<div style="font-weight:600;color:var(--accent);margin:12px 0 6px;font-family:sans-serif;font-size:0.85em;">${name} ${ref.chapter}</div>`;
    }

    const verseNums = ref.verses || chapterData.map((_, i) => i + 1);
    for (const vn of verseNums) {
      const vText = chapterData[vn - 1];
      if (vText !== undefined) {
        html += `<div class="verse-line"><span class="verse-num">${vn}</span>${vText}</div>`;
      }
    }
  }

  modalBody.innerHTML = html || '<div class="verse-error">Стихи не найдены</div>';
}

// Make all refs and persons clickable
document.addEventListener('click', (e) => {
  const ref = e.target.closest('.ref, .cal-ref, .principle-verse');
  if (ref) {
    e.preventDefault();
    e.stopPropagation();
    const text = ref.textContent.trim();
    if (text) openVerseModal(text);
    return;
  }

  const person = e.target.closest('.person');
  if (person) {
    e.preventDefault();
    e.stopPropagation();
    const name = person.dataset.person || person.textContent.trim();
    if (name) openPersonModal(name);
    return;
  }

  const location = e.target.closest('.location');
  if (location) {
    e.preventDefault();
    e.stopPropagation();
    const name = location.dataset.location || location.textContent.trim();
    if (name) openLocationModal(name);
  }
});
