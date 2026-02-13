# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

Интерактивные справочники по Пятикнижию Моисея на основании Синодального перевода Библии.

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
├── index.html              # Стартовая страница-хаб
├── sacrifices.html          # Жертвоприношения (~780 строк, только HTML-контент)
├── purity.html              # Чистота и нечистота (~1030 строк, только HTML-контент)
├── css/
│   ├── shared.css           # Общие стили всех тематических страниц (~480 строк)
│   ├── sacrifices.css        # Цвета жертв, календарь, легенда (~100 строк)
│   └── purity.css            # Цвета нечистоты, градиентные полосы, таблица (~120 строк)
├── js/
│   └── shared.js            # Общий JS: вкладки, карточки, таблица, модальное окно стихов (~260 строк)
├── Жертвы_в_Пятикнижии_анализ.md
├── Чистота_и_нечистота_анализ.md
├── TODO.md
└── synodal/                 # Русский Синодальный перевод в JSON (66 книг)
```

## Архитектура

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

### Навигация sacrifices.html — 6 вкладок

1. **Основные жертвы** — 5 карточек (всесожжение, хлебное, мирная, за грех, повинности)
2. **Особые жертвы** — 7 карточек (посвящение, Йом Киппур, рыжая телица, Пасха, назорей, завет, патриархи)
3. **Календарь** — 8 карточек с количеством животных по праздникам
4. **Сравнение** — сортируемая таблица
5. **Распределение** — CSS-диаграммы (Богу / священнику / приносящему)
6. **Принципы** — 8 богословских принципов

### Навигация purity.html — 7 вкладок

1. **Пища** — 4 карточки (наземные, водные, птицы, насекомые)
2. **Тело** — 5 карточек (роды, хронические истечения, поллюция, менструация, половой акт)
3. **Проказа** — 6 карточек (диагностика, виды, очищение, одежда, дом, ритуал)
4. **Мёртвое тело** — 4 карточки (основные правила, рыжая телица, очистительная вода, военная добыча)
5. **Стан** — 5 карточек (высылка из стана, отхожее место, военная чистота, проказа Мариам, хананейская мерзость)
6. **Сводная таблица** — сортируемая таблица всех видов нечистоты
7. **Принципы** — 8 богословских принципов

### Шаблон новой темы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Тема в Пятикнижии Моисея</title>
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

Основные файлы Пятикнижия: `gn.json` (Бытие), `ex.json` (Исход), `lv.json` (Левит), `nm.json` (Числа), `dt.json` (Второзаконие).

## Цветовое кодирование

### Жертвы (`css/sacrifices.css`)

| Жертва | CSS-переменная | Цвет |
|--------|---------------|------|
| Всесожжение | `--ola` | `#c0392b` красный |
| Хлебное | `--minha` | `#d4a017` золотой |
| Мирная | `--shlamim` | `#27ae60` зелёный |
| За грех | `--hattat` | `#2c3e80` синий |
| Повинности | `--asham` | `#7b2d8e` фиолетовый |

### Нечистота (`css/purity.css`)

| Категория | CSS-переменная | Цвет |
|-----------|---------------|------|
| Пища | `--food` | `#27ae60` зелёный |
| Тело | `--body` | `#2c3e80` синий |
| Истечения | `--discharge` | `#7b2d8e` фиолетовый |
| Мёртвое тело | `--death` | `#c0392b` красный |
| Проказа | `--leprosy` | `#d4a017` золотой |
| Стан | `--camp` | `#1a7a5a` тёмно-зелёный |
