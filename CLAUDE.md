# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

Интерактивные справочники по книгам Библии на основании Синодального перевода. **23 тематические страницы** покрывают все разделы Библии — от Бытия до Откровения.

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
├── index.html                # Главная — секции по разделам Библии (23 темы)
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
│── Цари и пророки (1 Царств — Малахия) — 2 темы
├── kings.html                # Цари и пророки (7 вкладок, диаграмма Ганта)
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
│   └── shared.js             # Общий JS: вкладки, карточки, таблица, модальное окно стихов
├── TODO.md
├── PROGRESS.md
└── synodal/                  # Русский Синодальный перевод в JSON (66 книг)
```

## Архитектура

### Главная страница (`index.html`)

Секции по разделам Библии: Пятикнижие (11), Завоевание и Судьи (2), Цари и пророки (2), Поэтические книги (3), Евангелия (1), Деяния (1), Послания (2), Откровение (1). Каждая секция — `.section-group` с заголовком и гридом карточек.

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
- `loadBook(fileId)` — загрузка JSON с кэшированием
- `parseRef(text, lastFileId)` — парсинг ссылок с поддержкой точек с запятой, диапазонов глав и carry-forward книги
- `parseChapters(spec, fileId)` — парсинг диапазонов и перечислений глав
- `parseVerses(spec)` — парсинг диапазонов стихов
- `openVerseModal(refText)` — модальное окно с текстом стихов
- Делегация кликов по `.ref, .cal-ref, .principle-verse`

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

## Синодальный перевод (synodal/)

JSON-файлы: массив глав, каждая глава — массив строк стихов (0-indexed).

```javascript
// Левит 1:4
const data = await fetch('synodal/lv.json').then(r => r.json());
const verse = data[0][3]; // глава 1 → индекс 0, стих 4 → индекс 3
```

Ключевые файлы: `gn.json` (Бытие), `ex.json` (Исход), `lv.json` (Левит), `nm.json` (Числа), `dt.json` (Второзаконие), `js.json` (И. Навин), `jud.json` (Судьи), `1sm.json`–`2kgs.json` (1–4 Царств), `mt.json` (Матфей), `act.json` (Деяния), `re.json` (Откровение).
