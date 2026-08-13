// Fill these values with the actual Bulgarian operator/seller details.
// The legal page deliberately shows missing values instead of inventing them.
export const operatorDetails = Object.freeze({
  legalName: '',
  legalForm: '',
  eikBulstat: '',
  registeredAddress: '',
  activityAddress: '',
  publicPhone: '',
  publicEmail: '',
  vatNumber: '',
  privacyContact: '',
  applicationRetention: '',
})

export const operatorDetailFields = Object.freeze([
  { key: 'legalName', bg: 'Пълно име / наименование', ru: 'Полное имя / наименование' },
  { key: 'legalForm', bg: 'Правна форма', ru: 'Правовая форма' },
  { key: 'eikBulstat', bg: 'ЕИК / БУЛСТАТ', ru: 'ЕИК / BULSTAT' },
  { key: 'registeredAddress', bg: 'Седалище и адрес', ru: 'Юридический адрес' },
  { key: 'activityAddress', bg: 'Адрес на дейността, ако е различен', ru: 'Адрес деятельности, если отличается' },
  { key: 'publicPhone', bg: 'Телефон за контакт', ru: 'Контактный телефон' },
  { key: 'publicEmail', bg: 'Имейл за контакт', ru: 'Контактный email' },
  { key: 'vatNumber', bg: 'ДДС номер, ако е приложимо', ru: 'Номер НДС, если применимо' },
])

export const missingDetailLabel = 'ЗА ДОПЪЛВАНЕ / НУЖНО ДОБАВИТЬ'
