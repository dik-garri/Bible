# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

Интерактивные справочники по книгам Библии на основании Синодального перевода. **25 тематических страниц** покрывают все разделы Библии — от Бытия до Откровения.

**Деплой:** https://dik-garri.github.io/Bible/

## Язык

Весь контент на русском языке. Ответы и комментарии в коде — по умолчанию на русском.

## Разработка

Нет сборки, линтеров или тестов. Статические HTML-файлы + общие CSS/JS.

```bash
# Локальный сервер (нужен для fetch JSON-файлов)
python3 -m http.server 8000
# или
npx serve .
```

Деплой: GitHub Pages из ветки `main`. Пуш в main → автоматическое обновление сайта.

## Структура файлов

```
Bible/
├── index.html                # Главная — секции по разделам Библии (25 тем)
│
│── Пятикнижие (Бытие — Второзаконие) — 11 тем
├── genesis-timeline.html     # Хронология книги Бытие (6 вкладок)
├── covenants.html            # Заветы (6 вкладок)
├── sacrifices.html           # Жертвоприношения (6 вкладок)
├── purity.html               # Чистота и нечистота (7 вкладок)
├── feasts.html               # Праздники и священные собрания (6 вкладок)
├── tabernacle.html           # Скиния (7 вкладок)
├── exodus.html               # История Исхода (7 вкладок)
├── wanderings.html           # Странствования Израиля (6 вкладок)
├── prophecies.html           # Пророчества и обетования (6 вкладок)
├── social-laws.html          # Законы о ближнем (6 вкладок)
├── names-of-god.html         # Имена и титулы Бога (6 вкладок)
│
│── Завоевание и Судьи (Иисус Навин — Руфь) — 2 темы
├── conquest.html             # Завоевание Ханаана (6 вкладок)
├── judges.html               # Судьи Израилевы (6 вкладок)
│
│── Цари и пророки (1 Царств — Малахия) — 4 темы
├── kings.html                # Цари и пророки (7 вкладок, диаграмма Ганта)
├── major-prophets.html       # Великие пророки (6 вкладок)
├── minor-prophets.html       # Малые пророки (6 вкладок)
├── exile.html                # Плен и возвращение (7 вкладок)
│
│── Поэтические книги (Иов — Песнь Песней) — 3 темы
├── job.html                  # Иов (6 вкладок)
├── psalms.html               # Псалмы (6 вкладок)
├── wisdom.html               # Притчи, Екклесиаст, Песнь Песней (5 вкладок)
│
│── Евангелия и Деяния — 2 темы
├── gospels.html              # Евангелия (6 вкладок)
├── acts.html                 # Деяния Апостолов (7 вкладок)
│
│── Послания (Римлянам — Иуды) — 2 темы
├── pauline.html              # Послания Павла (6 вкладок)
├── general-epistles.html     # Соборные послания (6 вкладок)
│
│── Откровение — 1 тема
├── revelation.html           # Откровение (7 вкладок)
│
├── css/
│   ├── shared.css            # Общие стили всех тематических страниц
│   ├── genesis-timeline.css  # + диаграмма Ганта патриархов
│   ├── covenants.css
│   ├── sacrifices.css
│   ├── purity.css
│   ├── feasts.css
│   ├── tabernacle.css
│   ├── exodus.css
│   ├── wanderings.css
│   ├── prophecies.css
│   ├── social-laws.css
│   ├── names-of-god.css
│   ├── conquest.css
│   ├── judges.css
│   ├── kings.css             # + диаграмма Ганта царей
│   ├── major-prophets.css
│   ├── minor-prophets.css
│   ├── exile.css
│   ├── job.css
│   ├── psalms.css
│   ├── wisdom.css
│   ├── gospels.css
│   ├── acts.css
│   ├── pauline.css
│   ├── general-epistles.css
│   └── revelation.css
├── js/
│   └── shared.js             # Общий JS: вкладки, карточки, таблица, модальные окна стихов, персон и локаций
├── persons.json              # База персонажей (160 записей: имя, даты, роль, биография)
├── locations.json            # База локаций (76 записей: тип, регион, описание, координаты)
├── geo/                      # GeoJSON-полигоны 14 регионов (OpenBible.info, CC BY 4.0)
├── og.png                    # OG-картинка для превью при шаринге (1200×630)
├── og-image.svg              # Исходник OG-картинки (SVG)
├── TODO.md
├── PROGRESS.md
└── synodal/                  # Русский Синодальный перевод в JSON (66 книг)
```

## Архитектура

### Главная страница (`index.html`)

Секции по разделам Библии: Пятикнижие (11), Завоевание и Судьи (2), Цари и пророки (4), Поэтические книги (3), Евангелия (1), Деяния (1), Послания (2), Откровение (1). Каждая секция — `.section-group` с заголовком и гридом карточек.

### Общий CSS (`css/shared.css`)

Палитра: пергамент `#faf6f0`, акцент `#b8860b`, текст `#2c1810`. Шрифт: Georgia serif. Mobile-first, адаптивный grid. CSS-переменные в `:root`.

Компоненты: header, sticky nav с градиентом, sections (вкладки), cards (раскрывающиеся), таблица (сортируемая), principles grid, distribution bars, verse modal, back-link, responsive breakpoints.

### Тематический CSS (`css/{topic}.css`)

Каждый файл определяет: цветовые переменные в `:root`, `.card--{category}` классы (icon, h3, steps) и уникальные компоненты темы.

### Общий JS (`js/shared.js`)

- `checkNavScroll()` — градиент-индикатор скролла навигации
- Tab navigation — переключение вкладок по `data-tab` / `.section[id]`
- `toggleCard(header)` — раскрытие/сворачивание карточек
- `sortTable(colIndex)` — сортировка таблицы (id=`compareTable`)
- `BOOK_MAP` — русское сокращение → ID файла (`'Лев'` → `'lv'`, 66 книг)
- `BOOK_FULL_NAME` — ID → полное название
- `loadBook(fileId)` — загрузка JSON книги с кэшированием
- `loadPersons()` — загрузка `persons.json` с кэшированием
- `loadLocations()` — загрузка `locations.json` с кэшированием
- `parseRef(text, lastFileId)` — парсинг ссылок с поддержкой точек с запятой, диапазонов глав и carry-forward книги
- `parseChapters(spec, fileId)` — парсинг диапазонов и перечислений глав
- `parseVerses(spec)` — парсинг диапазонов стихов
- `openVerseModal(refText)` — модальное окно с текстом стихов
- `openPersonModal(name)` — модальное окно с карточкой персоны (роль, даты, биография)
- `openLocationModal(name)` — модальное окно с карточкой локации (тип, регион, описание)
- Делегация кликов по `.ref, .cal-ref, .principle-verse`, `.person` и `.location`

### База персонажей (`persons.json`)

160 библейских персонажей. Каждая запись: `dates`, `role`, `bio` (1–2 предложения).

Разметка: `<span class="person">Авраам</span>` — клик открывает модальное окно.

Для склонённых форм: `<span class="person" data-person="Авраам">Авраама</span>` — `data-person` указывает каноническое имя (ключ в JSON).

Тёзки различаются квалификатором: `Иоанн` (апостол), `Иоанн Креститель`, `Иоанн Богослов`; `Иаков` (патриарх), `Иаков брат Господень`, `Иаков Зеведеев`, `Иаков Алфеев`.

### Ожидаемые ID в HTML

Каждая тематическая страница должна содержать:
- `id="navScroll"`, `id="navInner"` — навигация
- `id="verseOverlay"`, `id="verseModalTitle"`, `id="verseModalBody"`, `id="verseModalClose"` — модальное окно
- `id="compareTable"` — если есть сортируемая таблица
- `.nav-tab[data-tab]` + `.section[id]` — вкладки

### Шаблон новой темы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Тема — Библия</title>
<link rel="stylesheet" href="css/shared.css">
<link rel="stylesheet" href="css/topic.css">
</head>
<body>
<a href="index.html" class="back-link">&larr; Главная</a>
<header>...</header>
<nav>... .nav-tab[data-tab] ...</nav>
<main class="container">... .section[id] ...</main>
<!-- Verse modal -->
<div class="verse-overlay" id="verseOverlay">
  <div class="verse-modal">
    <div class="verse-modal-header">
      <h3 id="verseModalTitle">Загрузка...</h3>
      <button class="verse-modal-close" id="verseModalClose">&times;</button>
    </div>
    <div class="verse-modal-body" id="verseModalBody"></div>
  </div>
</div>
<script src="js/shared.js"></script>
</body>
</html>
```

### Правила для ссылок на Библию

- Ссылки ставятся **рядом с текстом**, к которому относятся — не группируются внизу карточки
- Формат: `<span class="ref">Лев. 1:3-9</span>`
- Сокращения книг должны совпадать с ключами `BOOK_MAP` в `shared.js`

### База локаций (`locations.json`)

76 библейских локаций. Каждая запись: `type` (город, регион, гора, река, море...), `region`, `desc` (1–2 предложения).

Опциональные поля для интерактивной карты:
- `coords`: `[lat, lon]` — координаты для маркера Leaflet
- `geometry`: `"geo/egypt.geojson"` — путь к GeoJSON-полигону региона

Разметка: `<span class="location">Иерусалим</span>` — клик открывает модальное окно (бирюзовый цвет `#2e8b7e`).

Для склонённых форм: `<span class="location" data-location="Египет">Египте</span>` — `data-location` указывает каноническое имя.

Для имён с дисамбигуатором в скобках: `data-location="Синай (гора)"` — ключ в JSON содержит пояснение.

### Интерактивная карта в модалке локаций

Если у локации есть `coords`, в модалке отображается мини-карта (Leaflet.js + CartoDB Voyager тайлы). Если есть `geometry` — поверх карты рисуется GeoJSON-полигон региона.

Leaflet CDN подключён ко всем 25 HTML-страницам. Координаты `coords` заданы для всех 76 локаций. GeoJSON-полигоны для всех 14 регионов (в `geo/`).

**Для подключения Leaflet к новой странице** — добавить в `<head>` и перед `shared.js`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<!-- перед shared.js: -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

**Источники данных:**
- Тайлы: CartoDB Voyager (бесплатно, без ключа, подписи латиницей)
- Координаты: вручную (Wikipedia/OpenStreetMap)
- Полигоны: OpenBible.info `geometry/` (CC BY 4.0, ~0.5–3 KB на файл после очистки)

### Как получить GeoJSON-полигоны из OpenBible.info

Репозиторий: `github.com/openbibleinfo/Bible-Geocoding-Data` (ветка `main`).

**Шаг 1 — найти ancient ID локации** в `data/ancient.jsonl` (~1341 запись):
```bash
curl -sL "https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/ancient.jsonl" -o /tmp/ancient.jsonl
grep -i '"Egypt"' /tmp/ancient.jsonl   # → "id": "af301ca"
```

**Шаг 2 — скачать GeoJSON** из `geometry/{ANCIENT_ID}.geojson`:
```bash
curl -sL "https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/geometry/af301ca.geojson"
```

**Формат файла — изобанды уверенности (isobands):**
FeatureCollection с MultiPolygon (9 вложенных полигонов, confidence 10%→90%) и Point (центроид). Вложенные полигоны — НЕ отдельные регионы, а контуры уверенности: внешний = «может быть тут» (10%), внутренний = «точно тут» (90%).

**Для отображения берём один полигон** (средний, ~50% уверенности):
```python
mp = data['features'][0]['geometry']  # MultiPolygon
mid = len(mp['coordinates']) // 2
single = { 'type': 'FeatureCollection', 'features': [{
    'type': 'Feature', 'properties': {},
    'geometry': { 'type': 'Polygon', 'coordinates': mp['coordinates'][mid] }
}]}
```

**Полигоны есть только у регионов** (Egypt, Canaan, Moab, Edom и т.д.). Города (Jerusalem, Babylon) имеют только Point — для них используем маркер.

**Известные ancient ID:**
| Локация | ancient ID |
|---------|-----------|
| Египет (Egypt) | af301ca |
| Ханаан (Canaan) | a90cbb3 |
| Галилея (Galilee) | a01d580 |
| Иудея (Judea) | ad93e17 |
| Самария (Samaria) | afe5fc4 |
| Едом (Edom) | a7d02f4 |
| Моав (Moab) | a2aaff8 |
| Аммон (Ammon) | a9e2e80 |
| Ассирия (Assyria) | a7c7f11 |
| Персия (Persia) | a7fba9f |
| Вавилония (Babylonia) | a8baf0e |
| Месопотамия (Mesopotamia) | a6e87e2 |
| Финикия (Phoenicia) | ae2c3e2 |
| Галатия (Galatia) | a2b7ed3 |

### Правила для локаций

- Формат: `<span class="location">Вавилон</span>` или `<span class="location" data-location="Египет">Египте</span>` (склонение)
- Имя в `data-location` (или textContent) должно совпадать с ключом в `locations.json`
- Те же правила пропуска, что и для персон: не в `<h3>`, `<nav>`, `<header>`, `<script>`, `<style>`, не внутри `.ref` или `.person`

### Правила для персон

- Формат: `<span class="person">Моисей</span>` или `<span class="person" data-person="Моисей">Моисея</span>` (склонение)
- Имя в `data-person` (или textContent) должно совпадать с ключом в `persons.json`
- Не оборачивать имена в `<h3>` карточек (конфликт с `toggleCard`), `<nav>`, `<header>`, `<script>`, `<style>`
- Не оборачивать имена внутри `<span class="ref">` (конфликт с обработчиком ссылок)
- При тёзках использовать `data-person` с квалификатором: `data-person="Иоанн Креститель"`

## Синодальный перевод (synodal/)

JSON-файлы: массив глав, каждая глава — массив строк стихов (0-indexed).

```javascript
// Левит 1:4
const data = await fetch('synodal/lv.json').then(r => r.json());
const verse = data[0][3]; // глава 1 → индекс 0, стих 4 → индекс 3
```

Ключевые файлы: `gn.json` (Бытие), `ex.json` (Исход), `lv.json` (Левит), `nm.json` (Числа), `dt.json` (Второзаконие), `js.json` (И. Навин), `jud.json` (Судьи), `1sm.json`–`2kgs.json` (1–4 Царств), `mt.json` (Матфей), `act.json` (Деяния), `re.json` (Откровение).
