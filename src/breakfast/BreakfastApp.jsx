import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LeadApplicationForm from '../LeadApplicationForm.jsx'
import { breakfastParticipationOptions } from '../leadForm.js'
import { findReferralPartner } from '../referralPartners.js'

const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`

const forumPageUrl = `${import.meta.env.BASE_URL}index.html`
const organizerTelegramUrl = 'https://t.me/maslovanataly'
const eventTitle = 'BUSINESS BREAKFAST 6 сентября'

const breakfastStart = new Date('2026-09-06T10:30:00+03:00').getTime()

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getTimeUntilBreakfast() {
  const difference = breakfastStart - Date.now()

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

const schedule = [
  ['10:30', 'Welcome и кофе', 'Знакомство участников, лёгкий формат общения и первые деловые контакты.'],
  ['11:00', 'Тренинг Натальи Масловой', 'Самопрезентация, позиционирование, доверие и система превращения контакта в клиента.'],
  ['12:00', 'Международная нетворкинг-сессия', 'Структурированный обмен контактами, мини-интервью и поиск точек сотрудничества.'],
  ['13:00', 'План действий', 'Кому написать, с кем встретиться и какие договорённости продолжить после встречи.'],
  ['13:30', 'Финиш встречи', 'Формальная часть заканчивается, общение и обмен контактами продолжаются.'],
]

const labSteps = [
  ['01', 'Создадите', 'Свою сильную самопрезентацию под конкретную аудиторию.'],
  ['02', 'Протестируете', 'Её сразу на реальных людях в зале, а не дома перед зеркалом.'],
  ['03', 'Познакомитесь', 'С предпринимателями и экспертами из разных стран Европы.'],
  ['04', 'Найдёте', 'Клиентов, партнёров, рекомендации и точки сотрудничества.'],
  ['05', 'Уйдёте', 'Не просто с контактами, а с планом продолжения отношений.'],
]

const bookRoute = [
  'Самопрезентация',
  'Знакомство',
  'Интерес',
  'Доверие',
  'Отношения',
  'Рекомендации',
  'Клиенты',
]

const openTools = [
  ['01', 'Позиционирование', 'За что именно вас должен запомнить человек.'],
  ['02', '30-секундная самопрезентация', 'Что сказать, чтобы захотели спросить: «Расскажите подробнее».'],
  ['03', 'Мост следующего контакта', 'Что должно произойти после «приятно познакомиться».'],
]

const lockedTools = ['04', '05', '06', '07', '08', '09', '10']

const quizQuestions = [
  {
    id: 'clients',
    question: 'Сколько реальных клиентов вы получили после последних трёх мероприятий?',
    answers: [
      { value: 'none', label: 'Ни одного', score: 0 },
      { value: 'few', label: '1 или 2', score: 2 },
      { value: 'many', label: '3 и больше', score: 3 },
    ],
  },
  {
    id: 'pitch',
    question: 'Есть ли у вас самопрезентация, которую человек может пересказать другому человеку?',
    answers: [
      { value: 'no', label: 'Нет', score: 0 },
      { value: 'partly', label: 'Что-то есть', score: 2 },
      { value: 'yes', label: 'Да', score: 3 },
    ],
  },
  {
    id: 'system',
    question: 'Есть ли у вас система работы с человеком после знакомства?',
    answers: [
      { value: 'no', label: 'Нет', score: 0 },
      { value: 'sometimes', label: 'Иногда', score: 2 },
      { value: 'yes', label: 'Да', score: 3 },
    ],
  },
]

const quizVerdicts = [
  {
    limit: 3,
    title: 'Коллекционер контактов',
    text: 'Вы знакомитесь, но большая часть возможностей остаётся в телефоне. Начните с самопрезентации и первого шага после знакомства.',
  },
  {
    limit: 6,
    title: 'Активный нетворкер',
    text: 'База уже есть. Осталось превратить отдельные действия в систему, которая работает и после мероприятия.',
  },
  {
    limit: 9,
    title: 'Архитектор связей',
    text: 'Вы работаете со связями осознанно. На завтраке ищите партнёрства и международное масштабирование.',
  },
]

const nicheOptions = [
  'маркетолог',
  'психолог',
  'коуч',
  'наставник',
  'риелтор',
  'финансовый консультант',
  'эксперт по туризму',
  'предприниматель',
]

const wheelPrizes = [
  'Стратегический разбор с Натальей Масловой',
  'Билет на международный форум 12 сентября',
  'Networking Book Checklist',
  'Стратегия кросс-маркетинга',
  'Разбор вашей самопрезентации',
  'Разбор Instagram-профиля и стратегии продвижения',
]

const audienceGroups = [
  {
    title: 'Продают экспертизу',
    items: ['Предприниматели', 'Эксперты и консультанты', 'Коучи и наставники'],
  },
  {
    title: 'Работают через доверие',
    items: ['Психологи', 'Специалисты по недвижимости', 'Финансовые консультанты'],
  },
  {
    title: 'Растут через связи',
    items: ['Специалисты в туризме', 'Владельцы онлайн-проектов', 'Владельцы офлайн-проектов'],
  },
]

const faqQuestions = [
  [
    'Что входит в участие за 15 €?',
    'Участие в тренинге, бизнес-нетворкинг, международная нетворкинг-сессия, рабочие материалы, чай, кофе и вода, а также персональный подарок каждому участнику.',
  ],
  [
    'Нужен ли опыт нетворкинга?',
    'Нет. Формат рассчитан и на тех, кто ходит на мероприятия годами, и на тех, кто только начинает выходить в деловое сообщество.',
  ],
  [
    'Как связан завтрак 6 сентября с форумом 12 сентября?',
    'Это два отдельных события. Бизнес-завтрак камерный, форум большой и международный. На завтраке разыгрываются билеты на форум и разбирается вся информация о нём.',
  ],
  [
    'Как подтвердить участие?',
    'Оставьте короткую заявку в конце страницы. Организаторы свяжутся с вами, пришлют детали встречи и условия оплаты.',
  ],
]

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        d="M6 10.5h12v9H6zM8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function ReadingProgress() {
  return <div className="reading-progress" aria-hidden="true" />
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Business Breakfast Bulgaria 2026, в начало">
        <span>Business Breakfast</span>
        <strong>Bulgaria 2026</strong>
      </a>
      <nav className="main-nav" aria-label="Основная навигация">
        <a href={forumPageUrl}>Форум 12 сентября</a>
        <a href="#test">Тест</a>
        <a href="#program">Программа</a>
        <a href="#price">Участие</a>
      </nav>
      <a className="header-action" href="#contact">
        <span className="header-action__full">Забронировать участие</span>
        <span className="header-action__short">Забронировать</span>
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <Header />
      <div className="hero-meta" aria-label="Дата и место">
        <span>6 сентября 2026 · 10:30</span>
        <span>BESARABIA Restaurant, Поморие</span>
      </div>

      <h1 className="hero-title" id="hero-title">
        <span>Business</span>
        <span className="hero-title__accent">Networking</span>
        <span>Bulgaria</span>
      </h1>

      <figure className="hero-panorama">
        <img
          src={asset('hero-beach.jpg')}
          alt="Побережье Солнечного берега у Чёрного моря"
          fetchPriority="high"
        />
      </figure>

      <p className="hero-intro">
        Мой золотой Networking Book: от самопрезентации до потока клиентов. Тренинг, завтрак и международный
        нетворкинг за три часа.
      </p>

      <a className="hero-action" href="#contact">
        <span>Забронировать участие</span>
        <span className="hero-action__icon">
          <ArrowIcon />
        </span>
      </a>
    </section>
  )
}

function Countdown() {
  const [remaining, setRemaining] = useState(getTimeUntilBreakfast)

  useEffect(() => {
    if (remaining.ended) return undefined

    const interval = window.setInterval(() => {
      setRemaining(getTimeUntilBreakfast())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [remaining.ended])

  return (
    <section className="countdown-strip" aria-labelledby="countdown-title">
      <div className="countdown-copy">
        <span>До бизнес-завтрака</span>
        <h2 id="countdown-title">6 сентября, 10:30</h2>
      </div>
      {remaining.ended ? (
        <p className="countdown-ended">Бизнес-завтрак уже начался</p>
      ) : (
        <div
          className="countdown-values"
          aria-label={`До бизнес-завтрака ${remaining.days} дней, ${remaining.hours} часов, ${remaining.minutes} минут, ${remaining.seconds} секунд`}
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

function Facts() {
  return (
    <section className="facts" aria-label="Ключевые факты встречи">
      <div>
        <span>Дата</span>
        <strong>6 сентября</strong>
      </div>
      <div>
        <span>Время</span>
        <strong>10:30 до 13:30</strong>
      </div>
      <div>
        <span>Место</span>
        <strong>Поморие</strong>
      </div>
      <div>
        <span>Участие</span>
        <strong>15 €</strong>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="problem section-light" id="about">
      <div className="problem-title">
        <h2>Сколько денег лежит в вашем телефоне</h2>
      </div>
      <div className="problem-copy">
        <p className="lead">
          После конференции вы уходите с десятками новых контактов. Через неделю визитки лежат в сумке, номера
          в телефоне, а люди уже не помнят, чем вы занимаетесь.
        </p>
        <p>
          Проблема не в нетворкинге. Проблема в том, что знакомство почти никогда само не превращается в
          отношения, доверие и клиента. Этот переход нужно строить, и 6 сентября мы будем делать именно это.
        </p>
        <ol className="problem-chain" aria-label="Путь от знакомства до клиента">
          <li>Знакомство</li>
          <li>Отношения</li>
          <li>Доверие</li>
          <li>Клиент</li>
        </ol>
      </div>
    </section>
  )
}

function Quiz() {
  const [answers, setAnswers] = useState({})

  const answeredCount = quizQuestions.filter((question) => answers[question.id]).length
  const complete = answeredCount === quizQuestions.length

  const score = quizQuestions.reduce((total, question) => {
    const chosen = question.answers.find((answer) => answer.value === answers[question.id])
    return total + (chosen ? chosen.score : 0)
  }, 0)

  const verdict = quizVerdicts.find((item) => score <= item.limit)

  return (
    <section className="quiz section-dark" id="test" aria-labelledby="quiz-title">
      <div className="section-heading section-heading--split">
        <h2 id="quiz-title">А вы готовы к нетворкингу</h2>
        <p>Три вопроса и тридцать секунд. Результат покажет, где именно теряются ваши возможности.</p>
      </div>

      <div className="quiz-body">
        <div className="quiz-questions">
          {quizQuestions.map((question, index) => (
            <fieldset className="quiz-question" key={question.id}>
              <legend>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {question.question}
              </legend>
              <div className="quiz-answers">
                {question.answers.map((answer) => (
                  <label className="quiz-answer" key={answer.value}>
                    <input
                      type="radio"
                      name={`quiz-${question.id}`}
                      value={answer.value}
                      checked={answers[question.id] === answer.value}
                      onChange={() =>
                        setAnswers((current) => ({ ...current, [question.id]: answer.value }))
                      }
                    />
                    <span>{answer.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="quiz-result" aria-live="polite">
          {complete ? (
            <>
              <span className="quiz-result__label">Ваш Networking Score</span>
              <strong className="quiz-result__score">
                {score}
                <small>из 9</small>
              </strong>
              <h3>{verdict.title}</h3>
              <p>{verdict.text}</p>
              <a className="quiz-result__action" href="#contact">
                Забронировать участие <ArrowIcon />
              </a>
              <button type="button" className="quiz-reset" onClick={() => setAnswers({})}>
                Пройти заново
              </button>
            </>
          ) : (
            <>
              <span className="quiz-result__label">Ваш Networking Score</span>
              <strong className="quiz-result__score quiz-result__score--empty" aria-hidden="true">
                ?
              </strong>
              <h3>Ответьте на три вопроса</h3>
              <p>
                Отвечено {answeredCount} из {quizQuestions.length}. Результат появится здесь, как только вы
                выберете все три варианта.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function Lab() {
  return (
    <section className="lab section-dark" aria-labelledby="lab-title">
      <div className="lab-intro">
        <h2 id="lab-title">Это не лекция о нетворкинге</h2>
        <p>
          Три часа работают как лаборатория деловых связей: вы не слушаете про знакомства, вы их создаёте прямо
          в зале.
        </p>
      </div>
      <ol className="lab-steps">
        {labSteps.map(([number, title, description]) => (
          <li key={number}>
            <span aria-hidden="true">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function NetworkingBook() {
  return (
    <section className="book section-light" aria-labelledby="book-title">
      <div className="book-cover">
        <span>Авторская система</span>
        <h2 id="book-title">
          Мой золотой
          <em>Networking Book</em>
        </h2>
        <p>От самопрезентации до потока клиентов.</p>
      </div>
      <ol className="book-route" aria-label="Маршрут от самопрезентации до клиентов">
        {bookRoute.map((stage, index) => (
          <li key={stage}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {stage}
          </li>
        ))}
      </ol>
      <p className="book-quote">
        Нетворкинг начинается не тогда, когда вы вошли в зал. И не заканчивается тогда, когда вы из него вышли.
      </p>
    </section>
  )
}

function Tools() {
  return (
    <section className="tools section-dark" aria-labelledby="tools-title">
      <div className="tools-heading">
        <h2 id="tools-title">Десять инструментов, готовых до входа в зал</h2>
        <p>Три из них показываем здесь. Остальные семь разбираем на тренинге и сразу применяем в зале.</p>
      </div>
      <div className="tools-grid">
        {openTools.map(([number, title, description]) => (
          <article className="tool tool--open" key={number}>
            <span className="tool__number" aria-hidden="true">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
        {lockedTools.map((number) => (
          <article className="tool tool--locked" key={number}>
            <span className="tool__number" aria-hidden="true">{number}</span>
            <span className="tool__lock">
              <LockIcon />
              <span className="sr-only">Инструмент раскрывается на тренинге</span>
            </span>
          </article>
        ))}
      </div>
      <p className="tools-note">Ещё семь инструментов вы получите на бизнес-завтраке 6 сентября.</p>
    </section>
  )
}

function cleanFragment(value) {
  return value.trim().replace(/[\s.,;:!?]+$/u, '')
}

function Generator() {
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [result, setResult] = useState('')
  const [feature, setFeature] = useState('')
  const [phrase, setPhrase] = useState('')
  const [copyState, setCopyState] = useState('idle')
  const phraseRef = useRef(null)

  const resolvedNiche = niche === 'другое' ? cleanFragment(customNiche) : niche
  const ready = Boolean(resolvedNiche && cleanFragment(audience) && cleanFragment(result))

  const buildPhrase = (event) => {
    event.preventDefault()
    if (!ready) return

    const sentences = [
      `Я ${resolvedNiche}.`,
      `Помогаю ${cleanFragment(audience)} ${cleanFragment(result)}.`,
    ]
    if (cleanFragment(feature)) {
      sentences.push(`Моя особенность: ${cleanFragment(feature)}.`)
    }

    setPhrase(sentences.join(' '))
    setCopyState('idle')
    window.requestAnimationFrame(() => phraseRef.current?.focus())
  }

  const copyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(phrase)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <section className="generator section-light" id="generator" aria-labelledby="generator-title">
      <div className="generator-intro">
        <h2 id="generator-title">Соберите свою самопрезентацию прямо сейчас</h2>
        <p>
          Четыре поля дают черновик фразы для знакомства. На встрече мы превратим её в самопрезентацию,
          которую люди захотят пересказывать друг другу.
        </p>
      </div>

      <form className="generator-form" onSubmit={buildPhrase}>
        <label className="form-field">
          <span>Я</span>
          <select value={niche} onChange={(event) => setNiche(event.target.value)}>
            <option value="">Выберите нишу</option>
            {nicheOptions.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
            <option value="другое">другое</option>
          </select>
        </label>

        {niche === 'другое' && (
          <label className="form-field">
            <span>Ваша ниша</span>
            <input
              type="text"
              value={customNiche}
              onChange={(event) => setCustomNiche(event.target.value)}
              maxLength="60"
              placeholder="эксперт по логистике"
            />
          </label>
        )}

        <label className="form-field">
          <span>Я помогаю кому</span>
          <input
            type="text"
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            maxLength="80"
            placeholder="экспертам и владельцам малого бизнеса"
          />
        </label>

        <label className="form-field">
          <span>Получить какой результат</span>
          <input
            type="text"
            value={result}
            onChange={(event) => setResult(event.target.value)}
            maxLength="80"
            placeholder="выстроить поток клиентов через рекомендации"
          />
        </label>

        <label className="form-field">
          <span>Моя особенность</span>
          <input
            type="text"
            value={feature}
            onChange={(event) => setFeature(event.target.value)}
            maxLength="80"
            placeholder="работаю с международными рынками"
          />
        </label>

        <button type="submit" className="generator-submit" disabled={!ready}>
          <span>Создать мою фразу</span>
          <ArrowIcon />
        </button>
        {!ready && (
          <p className="generator-hint">Заполните нишу, аудиторию и результат, чтобы собрать черновик.</p>
        )}
      </form>

      <div className="generator-output" aria-live="polite">
        {phrase ? (
          <>
            <span className="generator-output__label">Ваш черновик</span>
            <p className="generator-phrase" ref={phraseRef} tabIndex="-1">{phrase}</p>
            <div className="generator-output__actions">
              <button type="button" onClick={copyPhrase}>
                {copyState === 'copied' ? 'Скопировано' : 'Скопировать фразу'}
              </button>
              {copyState === 'failed' && (
                <span className="generator-copy-error">
                  Браузер не дал доступ к буферу обмена. Выделите текст и скопируйте вручную.
                </span>
              )}
            </div>
            <p className="generator-followup">
              Неплохо для черновика. На встрече мы уберём лишнее, добавим конкретику и проверим фразу на живых
              людях.
            </p>
          </>
        ) : (
          <>
            <span className="generator-output__label">Ваш черновик</span>
            <p className="generator-phrase generator-phrase--empty">
              Здесь появится ваша фраза для знакомства.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

function Program() {
  return (
    <section className="program section-dark" id="program">
      <div className="program-intro">
        <h2>180 минут, которые меняют окружение</h2>
        <h3>Бизнес-нетворкинг 6 сентября 2026, Поморие</h3>
        <p className="program-statline">Тренинг. Завтрак. Международный нетворкинг.</p>
        <p>
          Камерный формат: только 30 мест, подарки и розыгрыши стратегических сессий с Натальей Масловой.
        </p>
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

function Speaker() {
  return (
    <section className="speaker-solo section-dark" id="speaker" aria-labelledby="speaker-title">
      <figure className="speaker-solo__portrait">
        <img src={asset('natalia-maslova-crop2.jpg')} alt="Наталья Маслова" loading="lazy" />
      </figure>
      <div className="speaker-solo__copy">
        <p className="speaker-solo__field">Спикер · Германия</p>
        <h2 id="speaker-title">Наталья Маслова</h2>
        <p className="speaker-solo__role">
          Бизнес-тренер, бренд-маркетолог, PhD и MBA. Два гранта от компании Volkswagen. Эксперт по системным продажам, сообществам и нетворкингу.
        </p>
        <ul className="speaker-solo__facts">
          <li>
            <strong>20+</strong>
            <span>лет в бизнесе и маркетинге</span>
          </li>
          <li>
            <strong>28</strong>
            <span>лет в науке</span>
          </li>
          <li>
            <strong>5 000</strong>
            <span>проведённых тренингов</span>
          </li>
        </ul>
        <blockquote className="speaker-solo__quote">
          Мы разберём, как сделать так, чтобы один правильный
          контакт запускал следующий и постепенно создавал вокруг вас систему рекомендаций, клиентов и
          возможностей.
        </blockquote>
      </div>
    </section>
  )
}

function Gifts() {
  return (
    <section className="gifts section-dark" aria-labelledby="gifts-title">
      <h2 id="gifts-title">И это ещё не всё</h2>
      <div className="gifts-grid">
        <article className="gift">
          <span className="gift__marker" aria-hidden="true">01</span>
          <h3>Каждый участник получает подарок</h3>
          <p>Рабочие материалы и инструменты, чтобы продолжить нетворкинг после встречи.</p>
        </article>
        <article className="gift">
          <span className="gift__marker" aria-hidden="true">02</span>
          <h3>Пять самых активных</h3>
          <p>
            Получат персональный стратегический разбор с Натальей Масловой и возможность участия в
            международном проекте для расширения бизнеса.
          </p>
        </article>
        <article className="gift gift--wide">
          <span className="gift__marker" aria-hidden="true">03</span>
          <h3>Главный розыгрыш</h3>
          <p>
            Среди участников разыгрывается участие в международном форуме 12 сентября. На встрече разбирается
            вся информация о нём: программа, спикеры и условия участия.
          </p>
        </article>
      </div>

      <div className="bridge">
        <div className="bridge__step">
          <span>6 сентября</span>
          <strong>Business Breakfast</strong>
          <p>Камерная встреча, тренинг и международный нетворкинг.</p>
        </div>
        <div className="bridge__arrow" aria-hidden="true">
          <ArrowIcon />
        </div>
        <div className="bridge__step bridge__step--forum">
          <span>12 сентября</span>
          <strong>International Forum</strong>
          <p>Большое международное событие: восемь экспертов из восьми стран.</p>
          <a className="text-link" href={forumPageUrl}>
            Страница форума <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function Wheel() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [prizeIndex, setPrizeIndex] = useState(null)
  const pendingIndex = useRef(null)
  const segment = 360 / wheelPrizes.length

  const sectors = useMemo(
    () =>
      wheelPrizes
        .map((_, index) => {
          const color = index % 2 === 0 ? 'var(--ink)' : 'var(--paper-dim)'
          return `${color} ${index * segment}deg ${(index + 1) * segment}deg`
        })
        .join(', '),
    [segment],
  )

  const settle = useCallback(() => {
    if (pendingIndex.current === null) return
    setPrizeIndex(pendingIndex.current)
    pendingIndex.current = null
    setSpinning(false)
  }, [])

  const spin = () => {
    if (spinning) return

    const index = Math.floor(Math.random() * wheelPrizes.length)
    const targetAngle = (360 - (index * segment + segment / 2) + 360) % 360
    const currentAngle = ((rotation % 360) + 360) % 360
    const delta = (targetAngle - currentAngle + 360) % 360

    pendingIndex.current = index
    setPrizeIndex(null)
    setRotation(rotation + 360 * 4 + delta)

    if (prefersReducedMotion()) {
      settle()
      return
    }

    setSpinning(true)
  }

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== 'transform') return
    settle()
  }

  return (
    <section className="wheel-section section-dark" aria-labelledby="wheel-title">
      <div className="wheel-copy">
        <h2 id="wheel-title">Какой бонус ждёт вас</h2>
        <p>
          Это призовой фонд встречи. Колесо показывает, что в нём лежит. Сам розыгрыш проходит вживую
          6 сентября среди участников бизнес-завтрака.
        </p>
        <ol className="wheel-legend">
          {wheelPrizes.map((prize, index) => (
            <li key={prize} data-active={prizeIndex === index ? 'true' : undefined}>
              <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              {prize}
            </li>
          ))}
        </ol>
        <p className="wheel-terms">
          Забронируйте участие и получите право участвовать в розыгрыше бонусов на встрече.
        </p>
      </div>

      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden="true" />
        <div
          className="wheel-disc"
          data-spinning={spinning ? 'true' : undefined}
          style={{ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${sectors})` }}
          onTransitionEnd={handleTransitionEnd}
          aria-hidden="true"
        >
          {wheelPrizes.map((prize, index) => (
            <span
              className="wheel-disc__number"
              key={prize}
              style={{ transform: `rotate(${index * segment + segment / 2}deg)` }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          ))}
        </div>
        <button type="button" className="wheel-spin" onClick={spin} disabled={spinning}>
          {spinning ? 'Крутится' : 'Показать бонус'}
        </button>
        <p className="wheel-output" aria-live="polite">
          {prizeIndex === null
            ? 'Нажмите кнопку, чтобы увидеть один из бонусов призового фонда.'
            : `Выпал бонус: ${wheelPrizes[prizeIndex]}. Это пример из фонда, а не подтверждённый приз.`}
        </p>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="breakfast-pricing section-dark" id="price" aria-labelledby="price-title">
      <div className="breakfast-pricing__copy">
        <h2 id="price-title">Формат участия</h2>
        <p>Один билет на бизнес-завтрак 6 сентября. Количество мест ограничено форматом встречи.</p>
        <a className="text-link" href={organizerTelegramUrl} target="_blank" rel="noreferrer">
          Задать вопрос Организатору <ArrowIcon />
        </a>
      </div>

      <article className="breakfast-pass">
        <span className="breakfast-pass__date">6 сентября 2026 · Поморие</span>
        <h3>Бизнес-завтрак с тренингом</h3>
        <strong className="breakfast-pass__price">15 €</strong>
        <ul className="breakfast-pass__includes">
          <li>Участие в тренинге</li>
          <li>Бизнес-завтрак</li>
          <li>Международная нетворкинг-сессия</li>
          <li>Рабочие материалы</li>
          <li>Чай, кофе и вода</li>
          <li>Персональный подарок каждому участнику</li>
        </ul>
        <p className="breakfast-pass__note">
          Самые активные участники получают стратегический разбор и приглашение в международный проект.
        </p>
        <a className="breakfast-pass__action" href="#contact">
          Забронировать участие <ArrowIcon />
        </a>
      </article>
    </section>
  )
}

function Audience() {
  return (
    <section className="audience section-light" aria-labelledby="audience-title">
      <h2 id="audience-title">
        Если в вашем бизнесе сначала покупают вас, а потом ваш продукт, вам сюда
      </h2>
      <div className="audience-groups">
        {audienceGroups.map((group) => (
          <div className="audience-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="audience-note">
        Особенно полезно тем, кто строит бизнес через доверие, рекомендации и личные связи, и хочет расширить
        деловое окружение в Европе.
      </p>
    </section>
  )
}

function Coast() {
  return (
    <section className="coast section-dark" aria-labelledby="coast-title">
      <div className="section-heading section-heading--split">
        <h2 id="coast-title">Болгария в сентябре</h2>
        <p>
          Солнечный берег в начале сентября: тёплое море, спокойный город и лёгкий формат общения, в котором
          деловые разговоры получаются сами собой.
        </p>
      </div>
      <div className="coast-grid">
        <figure className="coast-item">
          <img src={asset('nesebar.png')} alt="Старый Несебр на побережье Чёрного моря" loading="lazy" />
          <figcaption>
            <strong>Старый Несебр</strong>
            <span>Исторический город в двадцати минутах от места встречи</span>
          </figcaption>
        </figure>
        <figure className="coast-item">
          <img src={asset('marina.jpg')} alt="Марина Святого Власа вечером" loading="lazy" />
          <figcaption>
            <strong>Святой Влас</strong>
            <span>Marina Dinevi и вечерняя линия побережья</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="faq section-dark" aria-labelledby="faq-title">
      <h2 id="faq-title">Практические вопросы</h2>
      <div className="faq-list">
        {faqQuestions.map(([question, answer]) => (
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
        <h2 id="contact-title">Забронировать участие</h2>
        <p>
          Оставьте контакт, и организаторы подтвердят место на бизнес-завтраке 6 сентября и пришлют детали.
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
      <LeadApplicationForm
        attribution={attribution}
        partner={partner}
        options={breakfastParticipationOptions}
        eventTitle={eventTitle}
      />
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="brand brand--footer">
        <span>Business Breakfast</span>
        <strong>Bulgaria 2026</strong>
      </div>
      <p>6 сентября · Солнечный берег, Болгария</p>
      <p className="rights-note">
        <a href={forumPageUrl}>Международный форум 12 сентября</a>
      </p>
    </footer>
  )
}

export default function BreakfastApp({ attribution }) {
  return (
    <div className="atlas-site atlas-site--breakfast">
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <ReadingProgress />
      <main id="main-content">
        <Hero />
        <Countdown />
        <Facts />
        <Problem />
        <Quiz />
        <Lab />
        <NetworkingBook />
        <Tools />
        <Generator />
        <Program />
        <Speaker />
        <Gifts />
        <Wheel />
        <Pricing />
        <Audience />
        <Coast />
        <Faq />
        <Contact attribution={attribution} />
      </main>
      <Footer />
    </div>
  )
}
