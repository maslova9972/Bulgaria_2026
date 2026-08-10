import { useState } from 'react'

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

export const organizerTelegramUrl = 'https://t.me/maslovanataly'

export const speakers = [
  {
    name: 'Наталья Видюл',
    country: 'Болгария',
    field: 'Развитие бизнеса',
    topic: 'Развитие бизнеса и создание премиального продукта',
    bio: 'Предприниматель с 2007 года. Развивает премиальный продукт и работает на международном рынке в 23 странах.',
    image: 'natalia-vidiul.jpg',
  },
  {
    name: 'Виктория Батулина',
    country: 'Болгария',
    field: 'Инвестиции',
    topic: 'Масштабирование без выгорания',
    bio: 'Более 30 лет предпринимательского опыта. Говорит о системном росте и инвестиционном мышлении.',
    image: 'viktoria-batulina.jpg',
  },
  {
    name: 'Елена Кива',
    country: 'Израиль',
    field: 'Психология бизнеса',
    topic: 'Психология денег: разреши себе больше',
    bio: 'MBA-коуч и автор метода Kiva. Более 15 лет работает с мышлением лидеров и владельцев бизнеса.',
    image: 'elena-kiva.jpg',
  },
  {
    name: 'Татьяна Шаповалова',
    country: 'Португалия',
    field: 'Личностный рост',
    topic: 'Масштаб как выбор',
    bio: 'Медицинский психолог, автор TTP Core™, Executive MBA. Более 25 лет в бизнесе и 8 лет в терапии.',
    image: 'tatiana-shapovalova.jpg',
  },
  {
    name: 'Галина Лунина',
    country: 'Украина',
    field: 'Соцсети и AI',
    topic: 'Как социальные сети меняют жизнь',
    bio: 'Эксперт GaliDe. 15 лет управленческого опыта, практикует системное развитие через контент и ежедневные привычки.',
    image: 'galina-lunina.jpg',
  },
  {
    name: 'Надежда Миколюк',
    country: 'Испания',
    field: 'Туризм и реферальный бизнес',
    topic: 'Партнёрские и реферальные модели',
    bio: '18 лет практического опыта, международная команда более 200 человек в 22 странах и свыше 2 500 обучающих сессий.',
    image: 'nadiia-mykoliuk-bright.jpg',
  },
  {
    name: 'Наталья Маслова',
    country: 'Германия',
    field: 'Системные продажи',
    topic: 'Продажи через влияние и доверие',
    bio: 'PhD, MBA, более 20 лет в бизнесе и 28 лет в науке. Провела 5 000 тренингов, развивает международное сообщество.',
    image: 'natalia-maslova-crop2.jpg',
  },
  {
    name: 'Татьяна Стихарева',
    country: 'Бельгия',
    field: 'Lifestyle-амбассадор',
    topic: 'Пассивный доход и международная команда',
    bio: '25 лет в бизнесе, 15 лет в MLM, международная команда более 400 человек и более 20 деловых путешествий.',
    image: 'tatiana-stikhareva.jpg',
  },
  {
    name: 'Тамара Гусева',
    country: 'Латвия',
    field: 'Доход и путешествия',
    topic: 'Новая профессиональная жизнь после 50',
    bio: 'Коуч, стилист и специалист по недвижимости с опытом более 30 лет. Последние пять лет живёт и работает за рубежом.',
    image: 'tamara-guseva.jpg',
  },
]

export const schedule = [
  ['12:00', 'Открытие и знакомство', 'Контекст дня, представление участников и первые связи.'],
  ['12:30', 'Выступления экспертов', 'Практические темы о бизнесе, деньгах, продажах и личном масштабе.'],
  ['14:00', 'Разборы и кейсы', 'Опыт участников, живые вопросы и решения из реальной практики.'],
  ['15:30', 'Обмен контактами', 'Структурированный нетворкинг между участниками из разных стран.'],
  ['16:30', 'Подарки', 'Общая часть программы и благодарность участникам.'],
  ['17:00', 'Свободное общение', 'Время для разговоров, продолжения знакомств и совместных планов.'],
]

export const excursions = [
  {
    title: 'Старый Несебр',
    note: 'Прогулка по историческому городу и семейная винодельня',
    image: 'nesebar.png',
  },
  {
    title: 'Морская прогулка',
    note: 'Праздничный выход в море продолжительностью более трёх часов',
    image: 'yacht.jpg',
  },
  {
    title: 'SPA-день',
    note: 'Вход в SPA оплачивается отдельно, 13 €',
    image: 'spa.jpg',
  },
  {
    title: 'Святой Влас',
    note: 'Marina Dinevi и вечерняя линия побережья',
    image: 'marina.jpg',
  },
  {
    title: 'Финальный вечер',
    note: 'Ресторан «Ханский шатёр»',
    image: 'hanska-shatra.jpg',
  },
]

export const options = [
  {
    people: 1,
    label: 'Один',
    title: 'Отдельные апартаменты',
    price: '500 €',
    perPerson: '500 € с человека',
  },
  {
    people: 2,
    label: 'Вдвоём',
    title: 'Апартаменты на двоих',
    price: '700 €',
    perPerson: '350 € с человека',
  },
  {
    people: 3,
    label: 'Втроём',
    title: 'Апартаменты на троих',
    price: '800 €',
    perPerson: '≈267 € с человека',
  },
]

export const testimonials = [
  {
    name: 'Надежда Порфирова',
    handle: '@modelnadiya',
    role: 'Модель · Тревел-эксперт · Доход через путешествия',
    image: 'nadezhda-porfirova.jpg',
    summary:
      'Надежда воспринимает поездку как сочетание развития и отдыха. Она ждёт живых знаний, практических идей и встреч с людьми, которые помогают яснее увидеть следующие шаги.',
  },
  {
    name: 'Татьяна',
    handle: '@tatianabalytska',
    role: 'Инвестор · Business & Travel',
    image: 'tatiana-balytska.jpg',
    summary:
      'Татьяна едет в Болгарию второй раз. Прошлогодняя поездка дала ей не только отдых, но и новые знакомства, идеи и более ясное понимание возможностей сообщества.',
  },
  {
    name: 'INNA',
    handle: '@patlan_inna',
    role: 'PM FITLINE · Германия · Бизнес онлайн',
    image: 'inna-patlan.jpg',
    summary:
      'Инна видит в поездке возможность наблюдать сильных практиков вживую, перенимать их подход к решениям и находить друзей и единомышленников из разных стран.',
  },
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Business & Travel Bulgaria 2026, в начало">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </a>
      <nav className="main-nav" aria-label="Основная навигация">
        <a href="#people">Эксперты</a>
        <a href="#program">Программа</a>
        <a href="#price">Стоимость</a>
      </nav>
      <a className="header-action" href="#contact">
        <span className="header-action__full">Получить программу</span>
        <span className="header-action__short">Запросить</span>
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <Header />
      <div className="hero-meta" aria-label="Дата и место">
        <span>8–13 сентября 2026</span>
        <span>Солнечный берег, Болгария</span>
      </div>

      <h1 className="hero-title" id="hero-title">
        <span>Болгария:</span>
        <span className="hero-title__accent">международный</span>
        <span>бизнес-тур</span>
      </h1>

      <figure className="hero-panorama">
        <img
          src={asset('hero-beach.jpg')}
          alt="Побережье Солнечного берега у Чёрного моря"
          fetchPriority="high"
        />
      </figure>

      <p className="hero-intro">
        Шесть дней у моря, где деловой форум, международный нетворкинг и путешествие становятся одной программой.
      </p>

      <a className="hero-action" href="#contact">
        <span>Получить программу</span>
        <ArrowIcon />
      </a>

      <div className="hero-index" aria-hidden="true">
        Black Sea · 42.69° N
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section className="facts" aria-label="Ключевые факты поездки">
      <div>
        <span>Когда</span>
        <strong>8–13 сентября</strong>
      </div>
      <div>
        <span>Где</span>
        <strong>Солнечный берег</strong>
      </div>
      <div>
        <span>Главный день</span>
        <strong>Форум 12 сентября</strong>
      </div>
      <div>
        <span>Формат</span>
        <strong>Бизнес + путешествие</strong>
      </div>
    </section>
  )
}

function WhySection() {
  return (
    <section className="why section-light" id="about">
      <div className="why-title">
        <h2>Не выбирать между развитием и морем</h2>
      </div>
      <div className="why-copy">
        <p className="lead">
          Переезд расширяет географию, но не всегда деловое окружение. Эта поездка собирает людей, которым нужны содержательные связи, новые рынки и живой обмен опытом.
        </p>
        <p>
          В программе есть основной форум, время на разговоры без сцены и маршрут по побережью. Можно приехать на всю поездку или выбрать отдельную часть.
        </p>
        <ul className="participation-list" aria-label="Варианты частичного участия">
          <li>Форум 12 сентября</li>
          <li>Морская прогулка</li>
          <li>Экскурсионный день</li>
          <li>Отдельное мероприятие</li>
        </ul>
        <a className="text-link" href="#contact">
          Уточнить формат участия <ArrowIcon />
        </a>
      </div>
    </section>
  )
}

function SpeakerRoster() {
  return (
    <section className="speakers section-dark" id="people">
      <div className="section-heading section-heading--split">
        <h2>Люди, с которыми начинается новый круг</h2>
        <p>
          Девять практиков из разных стран. Бизнес, инвестиции, психология, продажи, туризм и международные команды.
        </p>
      </div>

      <div className="speaker-roster">
        {speakers.map((speaker) => (
          <article className="speaker" key={speaker.name}>
            <div className="speaker-image">
              <img src={asset(speaker.image)} alt={speaker.name} loading="lazy" />
            </div>
            <div className="speaker-meta">
              <p>{speaker.field}</p>
              <h3>{speaker.name}</h3>
              <span>{speaker.country}</span>
            </div>
            <p className="speaker-topic">{speaker.topic}</p>
            <details>
              <summary>Об эксперте</summary>
              <p>{speaker.bio}</p>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}

function Program() {
  return (
    <section className="program section-dark" id="program">
      <div className="program-intro">
        <h2>12 сентября: основной день</h2>
        <p>Шесть часов от первого знакомства до свободного разговора после выступлений.</p>
      </div>
      <ol className="timeline">
        {schedule.map(([time, title, description]) => (
          <li key={time}>
            <time>{time}</time>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Excursions() {
  return (
    <section className="excursions section-dark" id="route">
      <div className="section-heading section-heading--split">
        <h2>Побережье продолжает разговор</h2>
        <p>
          Неформальная часть маршрута создана для контактов без спешки: город, море, SPA и общий финальный вечер.
        </p>
      </div>
      <div className="excursion-grid">
        {excursions.map((item) => (
          <figure className="excursion" key={item.title}>
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

function Pricing() {
  const [selected, setSelected] = useState(1)
  const option = options[selected]

  return (
    <section className="pricing section-dark" id="price">
      <div className="pricing-copy">
        <h2>Стоимость зависит только от размещения</h2>
        <p>
          Во всех вариантах включены пять ночей проживания и полная программа мероприятий. Перелёт и трансфер оплачиваются отдельно.
        </p>
        <div className="occupancy" role="group" aria-label="Количество участников в апартаментах">
          {options.map((item, index) => (
            <button
              type="button"
              key={item.people}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <span>{String(item.people).padStart(2, '0')}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="price-display" aria-live="polite">
        <span className="price-title">{option.title}</span>
        <strong>{option.price}</strong>
        <span>{option.perPerson}</span>
        <ul>
          <li>5 ночей проживания</li>
          <li>Полная программа мероприятий</li>
        </ul>
        <a href="#contact" className="price-action">
          Обсудить участие <ArrowIcon />
        </a>
      </div>
    </section>
  )
}

function Testimonials() {
  const [active, setActive] = useState(0)
  const testimonial = testimonials[active]

  return (
    <section className="testimonials section-dark" aria-labelledby="testimonial-title">
      <h2 id="testimonial-title">Почему участники выбирают поездку</h2>
      <div
        className="testimonial-stage"
        aria-live="polite"
      >
        <img src={asset(testimonial.image)} alt="" aria-hidden="true" />
        <div className="testimonial-copy">
          <span className="testimonial-summary-label">Кратко об отзыве</span>
          <p>{testimonial.summary}</p>
          <footer>
            <strong>{testimonial.name}</strong>
            <a href={`https://instagram.com/${testimonial.handle.slice(1)}`} target="_blank" rel="noreferrer">
              {testimonial.handle}
            </a>
            <span>{testimonial.role}</span>
          </footer>
        </div>
      </div>

      <div className="testimonial-tabs" aria-label="Выбрать отзыв">
        {testimonials.map((item, index) => (
          <button
            type="button"
            aria-pressed={active === index}
            key={item.handle}
            onClick={() => setActive(index)}
          >
            <img src={asset(item.image)} alt="" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const questions = [
    [
      'Что входит в стоимость?',
      'Пять ночей проживания и полная программа мероприятий. Перелёт и трансфер оплачиваются отдельно.',
    ],
    [
      'Можно приехать не на все шесть дней?',
      'Да. Можно выбрать форум 12 сентября, морскую прогулку, экскурсионный день или отдельное мероприятие. Стоимость частичного участия уточняется по контакту поездки.',
    ],
    [
      'Где проходит поездка?',
      'В районе Солнечного берега, Болгария. Детали размещения и точку встречи подтвердите по указанному контакту до оплаты.',
    ],
    [
      'Как подтвердить участие?',
      'Напишите слово «БОЛГАРИЯ» Наталье Масловой в Telegram. В ответ вы получите полную программу, условия оплаты и отмены.',
    ],
  ]

  return (
    <section className="faq section-dark" aria-labelledby="faq-title">
      <h2 id="faq-title">Практические вопросы</h2>
      <div className="faq-list">
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div>
        <h2 id="contact-title">Получите полную программу и условия участия</h2>
        <p>
          Напишите «БОЛГАРИЯ» организатору Наталье Масловой. Ответ придёт в личной переписке в Telegram.
        </p>
      </div>
      <div className="contact-actions">
        <a href={organizerTelegramUrl} target="_blank" rel="noreferrer">
          <span>Telegram · Организатор</span>
          <strong>Наталья Маслова · @maslovanataly</strong>
          <ArrowIcon />
        </a>
      </div>
      {/* Future funnel embed: mount the provider form inside this slot. */}
      <div className="lead-form-slot" id="lead-form" data-form-slot />
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="brand brand--footer">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </div>
      <p>8–13 сентября · Солнечный берег, Болгария</p>
      <p className="rights-note">
        Фотоматериалы: исходная страница события.
      </p>
      <a href="./classic.html">Классическая версия у моря</a>
    </footer>
  )
}

export default function App() {
  return (
    <div className="atlas-site">
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <main id="main-content">
        <Hero />
        <Facts />
        <WhySection />
        <SpeakerRoster />
        <Program />
        <Excursions />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
