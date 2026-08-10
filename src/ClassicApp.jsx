import {
  excursions,
  options,
  organizerTelegramUrl,
  schedule,
  speakers,
  testimonials,
} from './App.jsx'

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function ClassicHeader() {
  return (
    <header className="classic-header">
      <a className="classic-brand" href="#classic-top" aria-label="Business & Travel Bulgaria 2026, в начало">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </a>
      <nav aria-label="Навигация классической версии">
        <a href="#classic-people">Эксперты</a>
        <a href="#classic-program">Программа</a>
        <a href="#classic-price">Стоимость</a>
      </nav>
      <a className="classic-header-link" href="#classic-contact">
        <span className="classic-header-link__full">Условия участия</span>
        <span className="classic-header-link__short">Условия</span>
      </a>
    </header>
  )
}

function ClassicHero() {
  return (
    <section className="classic-hero" id="classic-top" aria-labelledby="classic-title">
      <ClassicHeader />
      <div className="classic-hero-photo" aria-hidden="true">
        <img src={asset('hero-beach.jpg')} alt="" fetchPriority="high" />
      </div>
      <div className="classic-hero-copy">
        <p className="classic-date">8–13 сентября 2026 · Солнечный берег</p>
        <h1 id="classic-title">Болгария: международный бизнес-тур</h1>
        <p className="classic-hero-intro">
          Шесть дней у Чёрного моря для разговоров, которые продолжаются после форума и превращаются в деловые связи.
        </p>
        <div className="classic-hero-actions">
          <a href="#classic-contact">
            Получить программу <Arrow />
          </a>
          <a href={organizerTelegramUrl} target="_blank" rel="noreferrer">
            Telegram Натальи Масловой
          </a>
        </div>
      </div>
      <div className="classic-hero-note">
        <span>Форум</span>
        <strong>12 сентября · 12:00–17:00</strong>
      </div>
    </section>
  )
}

function ClassicIntro() {
  return (
    <section className="classic-intro" id="classic-about">
      <h2>Море, форум и новый круг общения</h2>
      <div>
        <p className="classic-lead">
          Путешествие для русскоязычных предпринимателей и экспертов, которые живут в разных странах, но ищут сильное международное окружение.
        </p>
        <p>
          Главный деловой день дополнен прогулками, общими вечерами и временем на разговоры без сцены. Можно выбрать всю поездку или отдельную часть программы.
        </p>
        <a href="#classic-contact">Уточнить частичное участие <Arrow /></a>
      </div>
    </section>
  )
}

function ClassicPeople() {
  return (
    <section className="classic-people" id="classic-people">
      <div className="classic-section-title">
        <h2>Эксперты из разных стран, одна рабочая среда</h2>
        <p>Практики бизнеса, инвестиций, психологии, продаж, туризма и международных команд.</p>
      </div>
      <div className="classic-people-grid">
        {speakers.map((speaker) => (
          <article key={speaker.name} className="classic-person">
            <div className="classic-person-photo">
              <img src={asset(speaker.image)} alt={speaker.name} loading="lazy" />
            </div>
            <div className="classic-person-copy">
              <span>{speaker.country} · {speaker.field}</span>
              <h3>{speaker.name}</h3>
              <p>{speaker.topic}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ClassicProgram() {
  return (
    <section className="classic-program" id="classic-program">
      <div className="classic-program-heading">
        <h2>Один день с ясным ритмом</h2>
        <p>12 сентября · 12:00–17:00</p>
      </div>
      <ol>
        {schedule.map(([time, title, description]) => (
          <li key={time}>
            <time>{time}</time>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ClassicRoute() {
  return (
    <section className="classic-route" id="classic-route">
      <div className="classic-section-title">
        <h2>Пять поводов продолжить знакомство у моря</h2>
        <p>Исторический город, яхта, SPA, марина и общий финальный вечер.</p>
      </div>
      <div className="classic-route-grid">
        {excursions.map((item) => (
          <figure key={item.title}>
            <img src={asset(item.image)} alt={item.title} loading="lazy" />
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function ClassicPrice() {
  return (
    <section className="classic-price" id="classic-price">
      <div className="classic-price-heading">
        <h2>Три варианта размещения</h2>
        <p>
          В каждом варианте: пять ночей проживания и полная программа. Перелёт и трансфер оплачиваются отдельно.
        </p>
      </div>
      <div className="classic-rates" aria-label="Стоимость размещения">
        {options.map((option) => (
          <article key={option.people}>
            <span>{option.label}</span>
            <div>
              <h3>{option.title}</h3>
              <p>{option.perPerson}</p>
            </div>
            <strong>{option.price}</strong>
          </article>
        ))}
      </div>
      <a className="classic-price-action" href="#classic-contact">
        Обсудить подходящий вариант <Arrow />
      </a>
    </section>
  )
}

function ClassicVoice() {
  const voice = testimonials[1]
  return (
    <section className="classic-voice">
      <div className="classic-voice-photo">
        <img src={asset(voice.image)} alt={voice.name} loading="lazy" />
      </div>
      <div className="classic-voice-copy">
        <span className="classic-summary-label">Кратко об отзыве</span>
        <p>
          Татьяна возвращается в Болгарию во второй раз: прошлогодняя поездка дала ей новые знакомства, идеи и понимание возможностей сообщества.
        </p>
        <footer>
          <strong>{voice.name}</strong>
          <a href={`https://instagram.com/${voice.handle.slice(1)}`} target="_blank" rel="noreferrer">
            {voice.handle}
          </a>
          <span>{voice.role}</span>
        </footer>
      </div>
    </section>
  )
}

function ClassicFaq() {
  const items = [
    ['Что включено?', 'Пять ночей проживания и полная программа мероприятий.'],
    ['Что оплачивается отдельно?', 'Перелёт, трансфер и вход в SPA стоимостью 13 €.'],
    [
      'Можно участвовать частично?',
      'Да. Доступны форум 12 сентября, морская прогулка, экскурсионный день или отдельное мероприятие. Стоимость уточняется по контакту поездки.',
    ],
    [
      'Как забронировать место?',
      'Напишите «БОЛГАРИЯ» Наталье Масловой в Telegram. До оплаты уточните размещение, точку встречи, условия оплаты и отмены.',
    ],
  ]
  return (
    <section className="classic-faq">
      <h2>Перед поездкой</h2>
      <div>
        {items.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function ClassicContact() {
  return (
    <section className="classic-contact" id="classic-contact">
      <div>
        <h2>Встретимся на побережье</h2>
        <p>Напишите организатору Наталье Масловой, чтобы получить полную программу и актуальные условия участия.</p>
      </div>
      <div className="classic-contact-links">
        <a href={organizerTelegramUrl} target="_blank" rel="noreferrer">
          <span>Telegram · Организатор</span>
          <strong>Наталья Маслова · @maslovanataly</strong>
          <Arrow />
        </a>
      </div>
      {/* Future funnel embed: mount the provider form inside this slot. */}
      <div className="classic-lead-form-slot" id="lead-form" data-form-slot />
    </section>
  )
}

function ClassicFooter() {
  return (
    <footer className="classic-footer">
      <div className="classic-brand">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </div>
      <p>8–13 сентября · Солнечный берег, Болгария</p>
      <p>Фотоматериалы: исходная страница события.</p>
      <a href="./">Открыть модернистский атлас</a>
    </footer>
  )
}

export default function ClassicApp() {
  return (
    <div className="classic-site">
      <a className="classic-skip" href="#classic-main">Перейти к содержанию</a>
      <main id="classic-main">
        <ClassicHero />
        <ClassicIntro />
        <ClassicPeople />
        <ClassicProgram />
        <ClassicRoute />
        <ClassicPrice />
        <ClassicVoice />
        <ClassicFaq />
        <ClassicContact />
      </main>
      <ClassicFooter />
    </div>
  )
}
