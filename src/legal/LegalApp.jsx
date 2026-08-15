import ReadingProgress from '../ReadingProgress.jsx'
import { sitePageUrl } from '../sitePages.js'
import {
  missingDetailLabel,
  operatorDetailFields,
  operatorDetails,
} from './legalDetails.js'

const forumUrl = sitePageUrl('index.html')
const breakfastUrl = sitePageUrl('breakfast.html')

function OperatorDetails() {
  return (
    <dl className="legal-details">
      {operatorDetailFields.map((field) => (
        <div key={field.key}>
          <dt>
            <span lang="bg">{field.bg}</span>
            <small lang="ru">{field.ru}</small>
          </dt>
          <dd className={operatorDetails[field.key] ? '' : 'legal-missing'}>
            {operatorDetails[field.key] || missingDetailLabel}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function LanguagePair({ bg, ru }) {
  return (
    <div className="legal-language-pair">
      <div lang="bg">{bg}</div>
      <div lang="ru">{ru}</div>
    </div>
  )
}

function LegalHeader() {
  return (
    <header className="legal-header">
      <a className="brand" href={forumUrl} aria-label="Business & Travel Bulgaria 2026 — начало">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </a>
      <div className="legal-header__tools">
        <nav aria-label="Съдържание / Содержание">
          <a href="#provider">Доставчик</a>
          <a href="#privacy">Поверителност</a>
          <a href="#terms">Условия</a>
        </nav>
        <a className="header-action" href={forumUrl}>Към събитието</a>
      </div>
    </header>
  )
}

function DraftNotice() {
  return (
    <aside className="legal-draft" aria-labelledby="draft-title">
      <h2 id="draft-title">Не е окончателна правна страница</h2>
      <LanguagePair
        bg={(
          <p>
            Техническата структура и известните факти са добавени. Полетата, обозначени с
            „ЗА ДОПЪЛВАНЕ“, трябва да бъдат попълнени с действителните данни на продавача
            преди приемане на плащания или обвързващи резервации.
          </p>
        )}
        ru={(
          <p>
            Техническая структура и известные факты уже добавлены. Поля «НУЖНО ДОБАВИТЬ»
            следует заполнить реальными данными продавца до приёма платежей или юридически
            обязывающих бронирований.
          </p>
        )}
      />
    </aside>
  )
}

function ProviderSection() {
  return (
    <section className="legal-section" id="provider" aria-labelledby="provider-title">
      <h2 id="provider-title">Данни за доставчика <span lang="ru">/ Сведения о продавце</span></h2>
      <LanguagePair
        bg={(
          <p>
            Сайтът представя събитията Business & Travel Bulgaria 2026 и Business Networking
            Bulgaria 2026. В съдържанието Наталия Маслова е посочена като организатор и
            контакт в Telegram. Това не замества задължителните правни данни на действителния
            доставчик или продавач.
          </p>
        )}
        ru={(
          <p>
            Сайт представляет Business & Travel Bulgaria 2026 и Business Networking Bulgaria
            2026. В материала Наталья Маслова указана как организатор и контакт в Telegram.
            Это не заменяет обязательные юридические данные фактического продавца.
          </p>
        )}
      />
      <OperatorDetails />
    </section>
  )
}

function OfferSection() {
  return (
    <section className="legal-section" id="offer" aria-labelledby="offer-title">
      <h2 id="offer-title">Известна информация за услугите <span lang="ru">/ Известные условия</span></h2>
      <div className="legal-offers">
        <article>
          <h3>Форум · 12.09.2026</h3>
          <p lang="bg">Участие във форума и кафе пауза — 25 €.</p>
          <p lang="ru">Участие в форуме и кофе-брейк — 25 €.</p>
        </article>
        <article>
          <h3>Business & Travel · 08–13.09.2026</h3>
          <p lang="bg">Пакет с хотел: 500 € за един, 700 € за двама или 800 € за трима. Полетът и трансферът не са включени.</p>
          <p lang="ru">Пакет с отелем: 500 € за одного, 700 € за двоих или 800 € за троих. Перелёт и трансфер не включены.</p>
        </article>
        <article>
          <h3>Business Networking · 06.09.2026</h3>
          <p lang="bg">Участието в Business Networking е безплатно с персонална покана.</p>
          <p lang="ru">Участие в Business Networking бесплатно по персональному приглашению.</p>
        </article>
      </div>
      <LanguagePair
        bg={(
          <p>
            Формулярът на този сайт е искане за контакт. На сайта няма плащане и изпращането
            на формуляра само по себе си не потвърждава резервация или сключване на договор.
            Окончателните условия за плащане, отказ, анулиране и възстановяване трябва да бъдат
            предоставени от действителния продавач преди обвързваща поръчка.
          </p>
        )}
        ru={(
          <p>
            Форма на сайте является запросом на связь. На сайте нет оплаты, а отправка формы
            сама по себе не подтверждает бронирование и не заключает договор. Окончательные
            условия оплаты, отмены и возврата фактический продавец должен предоставить до
            оформления обязательного заказа.
          </p>
        )}
      />
    </section>
  )
}

function PrivacySection() {
  return (
    <section className="legal-section" id="privacy" aria-labelledby="privacy-title">
      <h2 id="privacy-title">Политика за поверителност <span lang="ru">/ Конфиденциальность</span></h2>
      <div className="legal-data-controller">
        <strong>Администратор на данни / Оператор данных</strong>
        <span className="legal-missing">{operatorDetails.legalName || missingDetailLabel}</span>
        <span className="legal-missing">{operatorDetails.privacyContact || operatorDetails.publicEmail || missingDetailLabel}</span>
      </div>

      <div className="legal-columns">
        <article>
          <h3>Какви данни се обработват</h3>
          <ul lang="bg">
            <li>име, Telegram, допълнителен контакт и държава;</li>
            <li>избран формат, коментар и съгласие във формуляра;</li>
            <li>код на препоръчващ партньор, UTM параметри, път и време на посещението;</li>
            <li>технически данни, необходими за хостинг, доставка на формуляра и защита от злоупотреба.</li>
          </ul>
        </article>
        <article>
          <h3>Какие данные обрабатываются</h3>
          <ul lang="ru">
            <li>имя, Telegram, дополнительный контакт и страна;</li>
            <li>выбранный формат, комментарий и согласие в форме;</li>
            <li>код рекомендателя, UTM-метки, путь и время посещения;</li>
            <li>технические данные для хостинга, доставки формы и защиты от злоупотреблений.</li>
          </ul>
        </article>
      </div>

      <div className="legal-columns">
        <article>
          <h3>Цели и услуги</h3>
          <p lang="bg">
            Данните се използват за отговор на заявката, подготовка на участие, защита на
            формуляра и отчитане на препоръката. Статичният сайт се доставя чрез GitHub Pages.
            При конфигуриране заявката преминава през Cloudflare Worker към Airtable;
            Turnstile се използва само когато е активиран. При резервния вариант посетителят
            сам продължава към Telegram.
          </p>
        </article>
        <article>
          <h3>Цели и сервисы</h3>
          <p lang="ru">
            Данные используются для ответа на заявку, подготовки участия, защиты формы и
            учёта рекомендации. Статический сайт размещён на GitHub Pages. При настроенной
            отправке заявка проходит через Cloudflare Worker в Airtable; Turnstile используется
            только когда включён. В резервном варианте посетитель сам переходит в Telegram.
          </p>
        </article>
      </div>

      <div className="legal-columns">
        <article>
          <h3>Съхранение и правно основание</h3>
          <p lang="bg">
            Кодът на препоръчващия партньор и UTM параметрите се пазят в браузъра до 30 дни
            само след съгласие. Полетата от заявката не се пазят в localStorage. Срокът за
            съхранение на изпратените заявки трябва да бъде допълнен от администратора:
            <span className="legal-missing legal-missing--inline">{operatorDetails.applicationRetention || missingDetailLabel}</span>.
          </p>
        </article>
        <article>
          <h3>Хранение и правовое основание</h3>
          <p lang="ru">
            Код рекомендателя и UTM-метки хранятся в браузере до 30 дней только после
            согласия. Поля заявки не сохраняются в localStorage. Срок хранения отправленных
            заявок должен указать оператор:
            <span className="legal-missing legal-missing--inline">{operatorDetails.applicationRetention || missingDetailLabel}</span>.
          </p>
        </article>
      </div>

      <LanguagePair
        bg={(
          <p>
            След попълване на администратора правните основания трябва да бъдат потвърдени
            за конкретния процес. Предвидената основа е: действия по искане на посетителя за
            отговор на заявката; легитимен интерес за сигурността; съгласие за 30-дневното
            локално съхранение на реферални данни. Външните доставчици могат да обработват
            данни извън ЕИП според приложимите им договори и механизми за трансфер; конкретната
            конфигурация трябва да бъде проверена от администратора.
          </p>
        )}
        ru={(
          <p>
            После добавления оператора правовые основания необходимо подтвердить для
            фактического процесса: действия по запросу посетителя для ответа на заявку;
            законный интерес для безопасности; согласие для 30-дневного локального хранения
            реферальных данных. Внешние сервисы могут обрабатывать данные вне ЕЭЗ по своим
            договорам и механизмам передачи; конкретную конфигурацию должен проверить оператор.
          </p>
        )}
      />

      <div className="legal-columns">
        <article>
          <h3>Вашите права</h3>
          <p lang="bg">
            Имате право на достъп, коригиране, изтриване, ограничаване, възражение,
            преносимост и оттегляне на съгласие, когато съответното право е приложимо. Можете
            да подадете жалба до Комисията за защита на личните данни.
          </p>
        </article>
        <article>
          <h3>Ваши права</h3>
          <p lang="ru">
            Вы вправе запросить доступ, исправление, удаление, ограничение, возражение,
            переносимость и отозвать согласие, когда соответствующее право применимо. Жалобу
            можно подать в Комиссию по защите персональных данных Болгарии.
          </p>
        </article>
      </div>
      <p className="legal-authority-links">
        <a href="https://cpdp.bg/en/contacts/" rel="noreferrer" target="_blank">Комисия за защита на личните данни</a>
      </p>
    </section>
  )
}

function TermsSection() {
  return (
    <section className="legal-section" id="terms" aria-labelledby="terms-title">
      <h2 id="terms-title">Условия за участие <span lang="ru">/ Условия участия</span></h2>
      <LanguagePair
        bg={(
          <div>
            <p>
              Публикуваните дати, обхват и цени са описани в раздела по-горе. Заявката служи
              за получаване на информация и контакт с организатора. Преди плащане продавачът
              трябва да предостави окончателна цена с приложимите данъци и такси, начин и срок
              на плащане, потвърждение, условия за анулиране и възстановяване, както и ред за
              рекламации.
            </p>
          </div>
        )}
        ru={(
          <div>
            <p>
              Опубликованные даты, состав и цены перечислены выше. Заявка нужна для получения
              информации и связи с организатором. До оплаты продавец должен сообщить конечную
              цену с применимыми налогами и сборами, способ и срок оплаты, порядок подтверждения,
              отмены, возврата и подачи претензий.
            </p>
          </div>
        )}
      />
      <p className="legal-authority-links">
        <a href="https://kzp.bg/bg/potrebiteli/for-traders/online-traders" rel="noreferrer" target="_blank">Комисия за защита на потребителите</a>
      </p>
    </section>
  )
}

function LegalFooter() {
  return (
    <footer className="footer legal-footer">
      <div className="brand brand--footer">
        <span>Business & Travel</span>
        <strong>Bulgaria 2026</strong>
      </div>
      <nav className="footer-links" aria-label="Събития / События">
        <a href={forumUrl}>Форум · 12.09</a>
        <a href={breakfastUrl}>Business Networking · 06.09</a>
      </nav>
      <p className="rights-note">Последна техническа редакция / Техническая редакция: 14.08.2026</p>
    </footer>
  )
}

export default function LegalApp() {
  return (
    <div className="legal-site">
      <a className="skip-link" href="#main-content">Към съдържанието / К содержанию</a>
      <LegalHeader />
      <ReadingProgress />
      <main id="main-content" className="legal-main">
        <header className="legal-hero">
          <h1>
            Правна<br />информация
            <span lang="ru">/ Юридическая<br />информация</span>
          </h1>
          <p>Bulgarian-first compliance draft · Български и руски</p>
        </header>
        <DraftNotice />
        <ProviderSection />
        <OfferSection />
        <PrivacySection />
        <TermsSection />
      </main>
      <LegalFooter />
    </div>
  )
}
