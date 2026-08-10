---
name: "Business & Travel Bulgaria 2026"
description: "Две самостоятельные редакционные версии лендинга о бизнес-поездке на Чёрное море."
colors:
  atlas-ink: "#0a1724"
  atlas-paper: "#eef2f2"
  atlas-paper-dim: "#dce5e5"
  atlas-cobalt: "#2857ff"
  atlas-sea-glass: "#a9c5c4"
  atlas-muted: "#b5c8cb"
  atlas-line-light: "rgba(10, 23, 36, 0.22)"
  atlas-line-dark: "rgba(238, 242, 242, 0.2)"
  classic-navy: "#071c2e"
  classic-navy-soft: "#102b41"
  classic-cream: "#f7f2e8"
  classic-stone: "#e6dac7"
  classic-brass: "#c8872c"
  classic-brass-light: "#e6bc74"
  classic-sea: "#7fa3aa"
  classic-muted-dark: "#49616c"
  classic-muted-light: "#b8c8cc"
  white: "#ffffff"
typography:
  atlas-hero:
    fontFamily: "Sofia Sans Condensed Variable, sans-serif"
    fontSize: "clamp(4.25rem, 8.2vw, 6rem)"
    fontWeight: 780
    lineHeight: 0.77
    letterSpacing: "-0.035em"
  atlas-display:
    fontFamily: "Sofia Sans Condensed Variable, sans-serif"
    fontSize: "clamp(3.6rem, 7vw, 6rem)"
    fontWeight: 720
    lineHeight: 0.83
    letterSpacing: "-0.035em"
  classic-display:
    fontFamily: "Cormorant Garamond Variable, serif"
    fontSize: "clamp(3.8rem, 7vw, 6rem)"
    fontWeight: 540
    lineHeight: 0.87
    letterSpacing: "-0.032em"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "0.69rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  sharp: "0px"
spacing:
  atlas-page-x: "clamp(1rem, 4vw, 4.5rem)"
  atlas-section-y: "clamp(5rem, 11vw, 10rem)"
  classic-page-x: "clamp(1rem, 5vw, 5rem)"
  classic-section-y: "clamp(5.5rem, 11vw, 10rem)"
components:
  atlas-action:
    backgroundColor: "{colors.atlas-cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "0 1rem"
    height: "2.75rem"
  classic-action:
    backgroundColor: "{colors.classic-brass}"
    textColor: "{colors.classic-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "0 1.2rem"
    height: "3.65rem"
  atlas-title-band-cobalt:
    backgroundColor: "{colors.atlas-cobalt}"
    textColor: "{colors.white}"
    typography: "{typography.atlas-hero}"
    rounded: "{rounded.sharp}"
    padding: "0.015em 0.1em 0.055em"
---

# Design System: Business & Travel Bulgaria 2026

## Overview

**Creative North Star: «Два взгляда на Чёрное море»**

Один продукт представлен двумя самостоятельными маршрутами, а не темами одного шаблона. `/` — «Черноморский модернистский атлас»: холодный, графичный полевой путеводитель с документальными кадрами, типографическими полосами и кобальтовым действием. `/classic.html` — классический вечер у моря: глубокий marine, тёплая латунь, кремовая бумага, кинематографичная фотография и высококонтрастный serif.

Обе версии сохраняют одну фактическую основу и один финальный сценарий: посетитель понимает формат, людей, программу 12 сентября и стоимость, затем пишет организатору Наталье Масловой в Telegram — `@maslovanataly` (`https://t.me/maslovanataly`).

**Ключевые характеристики:** редакционная иерархия; реальные люди раньше абстрактных обещаний; резкая геометрия без карточного UI; мобильный путь к контакту; честные факты без новых коммерческих заявлений.

## Colors

Токены во frontmatter нормативны. Atlas строится на ink, mineral paper, sea-glass и редком ярком cobalt; Classic — на marine, cream/stone и дозированной brass. Белый текст обязателен на кобальтовой полосе Atlas. Линии полупрозрачны и разделяют редакционные поля; тени их не заменяют.

**Правило разделения маршрутов.** Не смешивать cobalt/sea-glass с brass/cream внутри одной страницы и не превращать `/classic.html` в перекрашенный Atlas.

## Typography

Шрифты поставляются локально через пакеты `@fontsource-variable`, попадают в сборку Vite и не зависят от внешнего font-CDN:

- Atlas: `Sofia Sans Condensed Variable` для крупных заголовков и `Manrope Variable` для текста, навигации и меток.
- Classic: `Cormorant Garamond Variable` для заголовков и `Manrope Variable` для служебного текста.

Atlas использует плотный uppercase, очень короткий интерлиньяж и точную фактическую типографику. Classic сохраняет свободнее читаемый serif-ритм и не имитирует журнальность избытком курсива. Основной текст держать примерно в пределах `50–75ch`; метки — короткими, часто uppercase, с увеличенным трекингом.

## Layout

Обе страницы используют 12-колоночную desktop-сетку, широкие адаптивные поля и большие вертикальные интервалы из frontmatter. Секции чередуют полноширинные цветовые поля; списки людей и маршрута получают намеренно неравные размеры изображений. На мобильных колоночные секции складываются в один поток, а ростеры людей становятся горизонтальными `scroll-snap` лентами.

**Контракт первого экрана.** Header входит внутрь hero; вместе они занимают ровно `100dvh` (`100vh` — fallback). Следующая секция не должна попадать в первый экран на типовых desktop/mobile высотах. Минимальная высота: Atlas `37.5rem`, Classic `39rem`, на mobile обе — `35rem`.

Atlas: панорама проходит за тремя подогнанными по содержимому полосами заголовка (`width: max-content`): sea-glass/ink, cobalt/white, ink/mineral paper. Полосы не растягивать в одинаковые плашки. Classic: слева цельное marine-поле для чтения, справа фотография, растворённая маской; на mobile изображение уходит в нижнюю часть hero.

**Последовательность `/`:** hero → факты → ценность формата → эксперты → программа → побережье → интерактивная стоимость → отзывы → FAQ → контакт → footer.

**Последовательность `/classic.html`:** hero → вводная → эксперты → программа → маршрут → три тарифа → один отзыв → FAQ → контакт → footer.

**Breakpoints:** `980px` — скрыть desktop-навигацию и упростить многоколонные ростеры; `700px` — основной mobile-переход; `340px` — уменьшить hero-заголовок. Atlas дополнительно корректирует заголовок на `701–840px` и при desktop-высоте до `680px`. Новые правила должны продолжать эти границы, а не вводить соседние произвольные breakpoint’ы.

GitHub Pages — статическая multipage-сборка: `index.html` и `classic.html`, без серверного runtime и history fallback. `base: './'` обязателен; изображения подключаются через `import.meta.env.BASE_URL`, поэтому пути должны оставаться относительными и работать в подпапке репозитория.

## Elevation & Depth

Система плоская: `box-shadow` не используется. Глубину создают крупные тональные поля, перекрытие заголовка и панорамы, маски, документальные кропы, полупрозрачные линии, cyanotype/halftone обработка Atlas и тёплый световой слой Classic.

Движение короткое и смысловое: Atlas открывает горизонт wipe-анимацией (`1.25s`, задержка `120ms`), Classic проводит по морю узкую полосу закатного света (`1.4s`, задержка `180ms`). Hover-переходы меняют цвет/подчёркивание и слегка увеличивают фотографии; контент не зависит от JS-анимации и видим по умолчанию.

При `prefers-reduced-motion: reduce` smooth scroll отключается, а все animations/transitions сокращаются до `0.01ms` с одним повтором. Не добавлять обязательные scroll-reveal, параллакс или автопрокрутку.

## Shapes

Основной язык — прямые углы (`0px`), тонкие линии и прямоугольные поля. Atlas допускает жёсткие сдвиги полос и асимметричные кропы; Classic — спокойные рамки и маску растворения фотографии. Не добавлять pill-формы, стеклянные панели, мягкие универсальные карточки или декоративные бейджи.

## Components

### Навигация и действия

Шапки семантические, компактные, с одним заметным действием. На Atlas primary action — cobalt/white; на Classic — brass/navy либо тонкая brass-рамка. Hover меняет фон или проявляет подчёркивание; `:focus-visible` всегда заметен.

### Контентные коллекции

Эксперты и побережье — изображения с подписями, а не карточки. Atlas применяет холодный grayscale/cyanotype и halftone; Classic — мягкую десатурацию и лёгкий sepia. Программа — семантический `ol`; на desktop её вводная может быть sticky, на mobile становится статичной.

### Состояния и раскрытия

В Atlas выбор размещения и отзывов реализован настоящими `button` с `aria-pressed`; меняющийся контент объявляется через `aria-live="polite"`. В Classic тарифы и отзыв статичны. FAQ и биографии используют нативные `details/summary`, сохраняя клавиатурное управление.

### Контакт и будущая форма

Финальная CTA обеих страниц ведёт только к Наталье Масловой, `@maslovanataly`. В каждом contact-блоке обязателен пустой `#lead-form[data-form-slot]`: пока он пуст, `:empty` скрывает его; после вставки embed он занимает всю ширину сетки. Не помещать внутрь заглушку, иначе слот станет видимым.

### Изображения

Все растровые материалы лежат в `public/images` и вызываются по стабильному имени через helper с `import.meta.env.BASE_URL`. Имя файла — часть контракта (`hero-beach.jpg`, именные портреты, маршрутные и testimonial-файлы): при замене сохранять имя, назначение, близкое соотношение сторон и ключевую точку кропа. Это позволяет менять источник без перестройки JSX и композиции.

### Доступность

Сохранять skip-link, семантические `main/nav/section/ol`, логическую иерархию заголовков, содержательные `alt` у информативных фото и пустой `alt`/`aria-hidden` у декора. Фокус — контрастный outline `3px` с offset `4px`; интерактивные зоны — не меньше примерно `44px`. Не полагаться только на цвет: выбранные варианты имеют `aria-pressed`, раскрытия — нативное состояние. Внешние ссылки открываются с `rel="noreferrer"`.

## Do's and Don'ts

### Do

- **Do** сохранять фактические даты, место, программу, людей, цены и исключения из стоимости.
- **Do** держать mobile-путь от первого экрана к Telegram коротким и очевидным.
- **Do** проверять обе HTML-точки входа и относительные asset-пути после каждой структурной правки.
- **Do** считать права на исходные изображения обязательным launch gate: до публичной кампании права должны быть подтверждены либо файлы заменены лицензированными под теми же именами.

### Don't

- **Don't** смешивать визуальные тезисы двух маршрутов или унифицировать их в тему-переключатель.
- **Don't** показывать контент следующей секции внутри первого `100dvh`.
- **Don't** выдумывать отель, наличие мест, партнёров, оплату, возвраты, отзывы или иные коммерческие гарантии.
- **Don't** публиковать текущие source images как окончательные, пока вопрос прав не закрыт.
