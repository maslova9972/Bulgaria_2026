# Заявки и CRM: нативная форма → Cloudflare Worker → Airtable

Статический сайт на GitHub Pages не обращается к Airtable напрямую. Нативная React-форма отправляет JSON на публичный `VITE_LEAD_ENDPOINT`; Cloudflare Worker проверяет запрос, добавляет серверные значения и создаёт запись в Airtable. Airtable token остаётся только в Worker Secrets.

Если endpoint отсутствует, имеет недопустимый URL или недоступен, форма формирует заполненное сообщение для Telegram `@maslovanataly`. Это штатный fallback, а не ошибка конфигурации страницы.

## 1. Контракт нативной формы

Видимые поля соответствуют `src/LeadApplicationForm.jsx`:

| Поле | JSON | Обязательное | Ограничение |
| --- | --- | --- | --- |
| Имя | `name` | да | 2–80 символов |
| Telegram | `telegram` | да | 2–80 символов |
| Телефон или email | `alternate_contact` | нет | до 120 символов |
| Страна | `country` | нет | до 80 символов |
| Формат участия | `participation` | да | только разрешённый код |
| Комментарий | `comment` | нет | до 1000 символов |
| Согласие | `consent` | да | только `true` |
| Honeypot | `company_website` | нет | посетитель не должен его заполнять |

Разрешённые значения `participation`:

| Код | Отображаемое значение |
| --- | --- |
| `forum` | Только форум · 25 € |
| `package-1` | Полный пакет · 1 человек · 500 € |
| `package-2` | Полный пакет · 2 человека · 700 € |
| `package-3` | Полный пакет · 3 человека · 800 € |
| `presentation` | Самопрезентация на форуме |
| `undecided` | Ещё выбираю формат |

Форма также передаёт `referrer_name` и объект `attribution`. Полный payload имеет такую форму:

```json
{
  "name": "Тестовая заявка",
  "telegram": "@test_user",
  "alternate_contact": "",
  "country": "Германия",
  "participation": "forum",
  "comment": "",
  "consent": true,
  "company_website": "",
  "turnstile_token": "public-one-time-token",
  "referrer_name": "Наталья Маслова",
  "attribution": {
    "ref_first": "natalia-maslova",
    "ref_last": "natalia-maslova",
    "credited_ref": "natalia-maslova",
    "utm_source_first": "telegram",
    "utm_source_last": "telegram",
    "utm_medium_first": "social",
    "utm_medium_last": "social",
    "utm_campaign_first": "launch",
    "utm_campaign_last": "launch",
    "utm_content_first": "",
    "utm_content_last": "",
    "utm_term_first": "",
    "utm_term_last": "",
    "landing_first": "/repository/",
    "landing_last": "/repository/",
    "touch_at_first": "2026-08-10T10:00:00.000Z",
    "touch_at_last": "2026-08-10T10:00:00.000Z",
    "current_path": "/repository/"
  }
}
```

Успешный Worker отвечает JSON с HTTP 2xx, например `{"ok":true}`. Любой non-2xx считается ошибкой; через 15 секунд клиент отменяет запрос и предлагает Telegram. Имя, контакты и комментарий не сохраняются в `localStorage`.

## 2. Таблица Airtable

Рекомендуемая база — `BULGARIA 2026 · Заявки`, таблица — `Заявки`. Worker должен собирать `fields` сам и никогда не пересылать клиентский объект в Airtable целиком.

| Airtable | Тип | Источник |
| --- | --- | --- |
| `Имя` | Single line text | `name` |
| `Telegram` | Single line text | `telegram` |
| `Телефон` | Phone | сервер относит сюда дополнительный контакт без email-формата |
| `Email` | Email | сервер относит сюда дополнительный контакт в email-формате |
| `Страна` | Single line text | `country` |
| `Формат участия` | Single select | серверное отображение `participation` |
| `Комментарий` | Long text | `comment` |
| `Согласие` | Checkbox | `consent` |
| `referrer_name` | Single line text | имя партнёра, вычисленное Worker из проверенного `credited_ref` |
| `Статус` | Single select | default `Новая` |
| `Статус оплаты` | Single select | default `Не выставлено` |
| `Дата заявки` | Created time | Airtable, не клиент |

Для атрибуции создайте поля с точными именами ниже. Значения `touch_at_*` удобнее хранить как date/time, остальные — как text:

```text
ref_first
ref_last
credited_ref
utm_source_first
utm_source_last
utm_medium_first
utm_medium_last
utm_campaign_first
utm_campaign_last
utm_content_first
utm_content_last
utm_term_first
utm_term_last
landing_first
landing_last
touch_at_first
touch_at_last
current_path
```

Поле `company_website` в Airtable не создаётся. Если honeypot заполнен, Worker возвращает нейтральный успех, но не создаёт запись. Клиентские `credited_ref` и `referrer_name` не считаются доверенными: Worker заново выбирает `ref_last || ref_first` из allow-list и по нему вычисляет имя партнёра.

## 3. Безопасность Cloudflare Worker

Production Worker должен соблюдать минимальный контракт:

- принимать только `POST` и preflight `OPTIONS`; остальные методы возвращать с `405`;
- разрешать точный production origin GitHub Pages, а не `*`; CORS-заголовки добавлять также к preflight и ошибкам;
- принимать только `application/json`, ограничивать размер body и игнорировать неизвестные поля;
- повторять серверную валидацию длины, `participation`, `consent` и honeypot — клиентской проверки недостаточно;
- нормализовать управляющие символы и строить Airtable `fields` по allow-list;
- при настроенном Turnstile secret проверять одноразовый token, hostname и action `lead_submit` на сервере;
- ограничивать частоту запросов средствами Cloudflare и не записывать сырой IP в Airtable без отдельной правовой причины;
- не логировать полный payload с персональными данными и не возвращать клиенту внутренний ответ Airtable;
- возвращать короткие JSON-ошибки без token, base ID, stack trace и деталей upstream.

Реализация уже находится в `worker/src/index.js`, конфигурация — в `wrangler.jsonc`. Она использует `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`, `ALLOWED_ORIGINS`, `TURNSTILE_HOSTNAMES` и `TURNSTILE_ACTION`. Personal Access Token выдаётся с scope `data.records:write` и доступом только к базе `appr12dTRITFID8eg`. Token и `TURNSTILE_SECRET` хранятся как Cloudflare Secrets, не как Vite/GitHub Pages variables.

```bash
npx wrangler secret put AIRTABLE_TOKEN
npx wrangler secret put TURNSTILE_SECRET
```

Base/table identifiers и разрешённый origin можно держать в Worker variables, если политика проекта не считает их секретами. Для локальной разработки Worker используйте игнорируемый `.dev.vars`, не корневой `.env.example` фронтенда.

Перед production-деплоем замените localhost в `ALLOWED_ORIGINS` и `TURNSTILE_HOSTNAMES` на точный GitHub Pages/custom-domain origin. `TURNSTILE_SECRET` и `VITE_TURNSTILE_SITE_KEY` включаются парой: если secret задан без публичного site key, все реальные отправки будут отклонены.

Справка: [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Airtable Personal Access Tokens](https://airtable.com/developers/web/guides/personal-access-tokens), [Airtable Create records](https://airtable.com/developers/web/api/create-records).

## 4. Подключение endpoint к сайту

Для локального запуска создайте игнорируемый Git файл `.env.local`:

```env
VITE_LEAD_ENDPOINT=http://127.0.0.1:8787/api/leads
VITE_TURNSTILE_SITE_KEY=your_public_site_key
```

`normalizeLeadEndpoint` принимает HTTPS. HTTP разрешён только для `localhost` и `127.0.0.1`. Значение читается при сборке, поэтому после изменения `.env.local` перезапустите Vite.

`VITE_LEAD_ENDPOINT` публичен по своей природе. Никогда не добавляйте Airtable token, Cloudflare API token или иной секрет в `VITE_*`, `.env.example` либо клиентский код.

Для GitHub Pages:

1. Создайте repository variable `LEAD_ENDPOINT` со значением production Worker URL.
2. После настройки Turnstile создайте public repository variable `TURNSTILE_SITE_KEY`.
3. Workflow уже передаёт их шагу `npm run build`:

```yaml
env:
  VITE_LEAD_ENDPOINT: ${{ vars.LEAD_ENDPOINT }}
  VITE_TURNSTILE_SITE_KEY: ${{ vars.TURNSTILE_SITE_KEY }}
```

Текущий `.github/workflows/pages.yml` уже содержит это сопоставление. Пока Worker не опубликован и repository variable не задана, production-сборка оставляет `VITE_LEAD_ENDPOINT` пустым и отправляет заполненные заявки через Telegram-fallback.

## 5. Проверка перед запуском

1. Без `.env.local` отправьте валидную форму: должен открыться Telegram с заполненными данными; при заблокированном popup должна появиться обычная ссылка.
2. С локальным/тестовым endpoint проверьте `POST`, `OPTIONS`, точный CORS origin и JSON-ответ.
3. Отправьте каждый код `participation` и убедитесь, что Airtable получает правильное отображаемое значение.
4. Отправьте ссылку `?ref=natalia-maslova&utm_source=telegram` и проверьте `ref_first`, `ref_last`, `credited_ref` и UTM-поля.
5. Заполните honeypot, передайте неизвестный slug, неверный `Content-Type` и oversized body: запись создаваться не должна. При включённом Turnstile также проверьте пустой, истёкший и повторно использованный token.
6. Имитируйте non-2xx и таймаут: введённые значения должны сохраниться, а Telegram-ссылка — появиться.
7. Убедитесь, что в browser bundle, DevTools, Worker logs и Airtable нет API token; в `localStorage` есть только атрибуция.
8. До приёма реальных данных опубликуйте фактическую политику конфиденциальности и согласуйте срок хранения заявок.

## 6. Реферальные ссылки экспертов

После публикации сайта выполните:

```bash
npm run referrals -- https://username.github.io/repository/
```

Команда выдаст отдельную ссылку для каждого из девяти профилей на странице. Допустимы только заранее зарегистрированные slug. Браузер хранит first/last-touch атрибуцию 30 дней; `credited_ref` использует последний подтверждённый реферальный переход, а `ref_first` сохраняется для истории.

Ограничение браузерной атрибуции: посетитель может очистить хранилище, открыть ссылку на другом устройстве или вручную изменить URL. Для текущей ручной сверки заявок и оплат этого достаточно; для юридически спорных комиссий нужен серверный идентификатор и привязка к платёжной транзакции.
