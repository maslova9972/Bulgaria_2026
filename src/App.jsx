import { useEffect, useState } from 'react'
import LeadApplicationForm from './LeadApplicationForm.jsx'
import ReadingProgress from './ReadingProgress.jsx'
import { findReferralPartner } from './referralPartners.js'
import { openPrivacyPreferences } from './privacyConsent.js'
import { sitePageUrl } from './sitePages.js'

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

const breakfastPageUrl = sitePageUrl('breakfast.html')
const legalPageUrl = sitePageUrl('legal.html')
const organizerTelegramUrl = 'https://t.me/maslovanataly'

const forumStart = new Date('2026-09-12T12:00:00+03:00').getTime()

function getTimeUntilForum() {
  const difference = forumStart - Date.now()

  if (difference <= 0) {
    return { ended: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    ended: false,
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  }
}

const speakers = [
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

const schedule = [
  ['12:00', 'Открытие и знакомство', 'Контекст дня, представление участников и первые связи.'],
  ['12:30', 'Выступления экспертов', 'Практические темы о бизнесе, деньгах, продажах и личном масштабе.'],
  ['14:00', 'Разборы и кейсы', 'Опыт участников, живые вопросы и решения из реальной практики.'],
  ['15:30', 'Обмен контактами', 'Структурированный нетворкинг между участниками из разных стран.'],
  ['16:30', 'Подарки', 'Общая часть программы и благодарность участникам.'],
  ['17:00', 'Свободное общение', 'Время для разговоров, продолжения знакомств и совместных планов.'],
]

const excursions = [
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

const options = [
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

const testimonials = [
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

function Countdown() {
  const [remaining, setRemaining] = useState(getTimeUntilForum)

  useEffect(() => {
    if (remaining.ended) return undefined

    const interval = window.setInterval(() => {
      setRemaining(getTimeUntilForum())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [remaining.ended])

  return (
    <section className="countdown-strip" aria-labelledby="countdown-title">
      <div className="countdown-copy">
        <span>До главного дня</span>
        <h2 id="countdown-title">Форум 12 сентября</h2>
      </div>
      {remaining.ended ? (
        <p className="countdown-ended">Форум уже начался</p>
      ) : (
        <div
          className="countdown-values"
          aria-label={`До форума ${remaining.days} дней, ${remaining.hours} часов, ${remaining.minutes} минут, ${remaining.seconds} секунд`}
        >
          {[
            ['Дней', remaining.days],
            ['Часов', remaining.hours],
            ['Минут', remaining.minutes],
            ['Секунд', remaining.seconds],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{String(value).padStart(2, '0')}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
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
        <a href="#program">Программа</a>
        <a href="#people">Эксперты</a>
        <a href="#price">Стоимость</a>
        <a href={breakfastPageUrl}>Бизнес завтрак 6 сентября</a>
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
        <span className="hero-action__icon">
          <ArrowIcon />
        </span>
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
        <span>Главный день</span>
        <strong>12 сентября</strong>
      </div>
      <div>
        <span>Спикеры</span>
        <strong>из 8 стран</strong>
      </div>
      <div>
        <span>Участники</span>
        <strong>Из 12+ стран</strong>
      </div>
      <div>
        <span>Форум + кофе-брейк</span>
        <strong>от 25 €</strong>
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
          Эксперты и участники программы из восьми стран. Бизнес, инвестиции, психология, продажи, туризм и международные команды.
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
        <h3>Первый Международный форум экспертов BULGARIA 2026</h3>
        <p className="program-statline">8 экспертов. 8 стран. Участники из 12+ стран.</p>
        <p>Один день для предпринимателей, экспертов и людей, создающих и развивающих свой бизнес в Европе.</p>
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
      <div className="program-details">
        <p>
          На одной площадке: практический опыт в темах <strong>масштабирования бизнеса, психологии денег, личного бренда и AI, партнёрских моделей, продаж через сообщества, международных команд и новых источников дохода.</strong>
        </p>
        <p>
          Но главная ценность форума: <strong>люди, международное окружение и новые деловые связи.</strong> Здесь можно найти клиентов, партнёров и идеи для совместных проектов.
        </p>
        <div className="program-local">
          <h3>Возможность для экспертов и предпринимателей Болгарии</h3>
          <p>
            Если вы живёте и развиваете бизнес или экспертность в Болгарии, на форуме можно представить себя, коротко рассказать о проекте, обменяться контактами и стать заметнее для международной аудитории.
          </p>
          <p>
            <strong>Представление себя и бизнеса является отдельным форматом участия за дополнительную плату.</strong> Условия организаторы расскажут индивидуально.
          </p>
          <a className="text-link" href={organizerTelegramUrl} target="_blank" rel="noreferrer">
            Узнать условия презентации <ArrowIcon />
          </a>
        </div>
        <p className="program-evening">
          Вечером общение продолжится в неформальной атмосфере: ужин, живая музыка и вечерняя программа в Ханском шатре.
        </p>
        <p className="program-quote">
          Иногда для следующего уровня бизнеса нужен не ещё один курс. Нужны другие люди в вашем окружении.
        </p>
      </div>
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
        <h2>Выберите формат участия</h2>
        <p>
          Можно приехать только на конференцию 12 сентября или выбрать всю шестидневную программу с проживанием.
        </p>
        <article className="conference-pass">
          <span>12 сентября 2026, Болгария</span>
          <h3>Международный форум экспертов</h3>
          <div>
            <strong>от 25 €</strong>
            <p>Участие в форуме + кофе-брейк</p>
          </div>
          <a href="#contact">
            Забронировать участие <ArrowIcon />
          </a>
        </article>
      </div>

      <div className="price-display" aria-live="polite">
        <div className="package-label">
          <h3>Полный пакет с отелем</h3>
          <p>5 ночей, форум и программа поездки. Перелёт и трансфер оплачиваются отдельно.</p>
        </div>
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
        <span className="price-title">{option.title}</span>
        <strong>{option.price}</strong>
        <span>{option.perPerson}</span>
        <ul>
          <li>5 ночей проживания</li>
          <li>Полная программа мероприятий</li>
        </ul>
        <a href="#contact" className="price-action">
          Выбрать полный пакет <ArrowIcon />
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
      'Какие есть форматы участия?',
      'Только форум 12 сентября стоит 25 € и включает кофе-брейк. Полный пакет включает пять ночей проживания, форум и программу поездки.',
    ],
    [
      'Что оплачивается отдельно?',
      'В полном пакете отдельно оплачиваются перелёт и трансфер. Представление своего бизнеса на форуме является дополнительным платным форматом, условия можно уточнить у Натальи.',
    ],
    [
      'Где проходит поездка?',
      'В районе Солнечного берега, Болгария. Детали размещения и точку встречи подтвердите по указанному контакту до оплаты.',
    ],
    [
      'Как подтвердить участие?',
      'Оставьте короткую заявку в конце страницы. Организаторы свяжутся с вами, пришлют полную программу, условия оплаты и отмены.',
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

function Contact({ attribution }) {
  const partner = findReferralPartner(attribution.credited_ref)

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <h2 id="contact-title">Оставьте заявку на участие</h2>
        <p>
          Выберите формат, оставьте контакт — организаторы пришлют полную программу и ответят на вопросы лично.
        </p>
        {partner && (
          <div className="referral-attribution" role="status" aria-label={`Реферальный партнёр: ${partner.name}`}>
            <img src={asset(partner.image)} alt="" aria-hidden="true" />
            <div>
              <span>По приглашению</span>
              <strong>{partner.name}</strong>
              <small>Реферальная ссылка учтена в заявке</small>
            </div>
          </div>
        )}
      </div>
      <LeadApplicationForm attribution={attribution} partner={partner} />
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
      <div className="footer-meta">
        <nav className="footer-links" aria-label="Юридическая информация">
          <a href={`${legalPageUrl}#provider`}>Правна информация</a>
          <a href={`${legalPageUrl}#privacy`}>Конфиденциальность</a>
          <a href={`${legalPageUrl}#terms`}>Условия</a>
          <button type="button" onClick={openPrivacyPreferences}>Настройки приватности</button>
        </nav>
        <p className="rights-note">Фотоматериалы: исходная страница события.</p>
      </div>
    </footer>
  )
}

export default function App({ attribution }) {
  return (
    <div className="atlas-site">
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <Header />
      <ReadingProgress />
      <main id="main-content">
        <Hero />
        <Countdown />
        <Facts />
        <WhySection />
        <Program />
        <SpeakerRoster />
        <Excursions />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact attribution={attribution} />
      </main>
      <Footer />
    </div>
  )
}
