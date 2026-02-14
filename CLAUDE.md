# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

Интерактивные справочники по книгам Библии на основании Синодального перевода.

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
├── index.html                # Главная — секции по разделам Библии
│
│── Пятикнижие (Бытие — Второзаконие)
├── genesis-timeline.html     # Хронология книги Бытие (6 вкладок)
├── covenants.html            # Заветы (6 вкладок)
├── sacrifices.html           # Жертвоприношения (6 вкладок)
├── purity.html               # Чистота и нечистота (7 вкладок)
├── feasts.html               # Праздники и священные собрания (6 вкладок)
├── tabernacle.html           # Скиния (7 вкладок)
│
│── Завоевание и Судьи (Иисус Навин — Руфь)
├── judges.html               # Судьи Израилевы (6 вкладок) [в разработке]
│
│── Цари и пророки (1 Царств — Малахия)
├── kings.html                # Цари и пророки (6 вкладок)
│
├── css/
│   ├── shared.css            # Общие стили всех тематических страниц (~480 строк)
│   ├── sacrifices.css
│   ├── purity.css
│   ├── feasts.css
│   ├── tabernacle.css
│   ├── covenants.css
│   ├── genesis-timeline.css  # + диаграмма Ганта
│   ├── kings.css
│   └── judges.css            # [в разработке]
├── js/
│   └── shared.js             # Общий JS: вкладки, карточки, таблица, модальное окно стихов (~260 строк)
├── analysis/                 # Текстовые анализы по каждой теме (*_анализ.md)
├── TODO.md
└── synodal/                  # Русский Синодальный перевод в JSON (66 книг)
```

## Архитектура

### Главная страница (`index.html`)

Секции по разделам Библии: Пятикнижие, Завоевание и Судьи, Цари и пророки, Евангелия, Деяния, Послания, Откровение. Каждая секция — `.section-group` с заголовком и гридом карточек. Будущие темы отмечены `.topic-card--soon`.

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
- `parseRef(text)` — парсинг ссылок `"Лев. 1:3–9"`, `"Быт. 22:2, 13–14"`
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

## Синодальный перевод (synodal/)

JSON-файлы: массив глав, каждая глава — массив строк стихов (0-indexed).

```javascript
// Левит 1:4
const data = await fetch('synodal/lv.json').then(r => r.json());
const verse = data[0][3]; // глава 1 → индекс 0, стих 4 → индекс 3
```

Ключевые файлы: `gn.json` (Бытие), `ex.json` (Исход), `lv.json` (Левит), `nm.json` (Числа), `dt.json` (Второзаконие), `js.json` (И. Навин), `jud.json` (Судьи), `rt.json` (Руфь), `1sm.json`–`2kgs.json` (1–4 Царств).
