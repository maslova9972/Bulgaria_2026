export const referralPartners = Object.freeze([
  { name: 'Наталья Видюл', slug: 'natalia-vidiul', image: 'natalia-vidiul.jpg' },
  { name: 'Виктория Батулина', slug: 'viktoria-batulina', image: 'viktoria-batulina.jpg' },
  { name: 'Елена Кива', slug: 'elena-kiva', image: 'elena-kiva.jpg' },
  { name: 'Татьяна Шаповалова', slug: 'tatiana-shapovalova', image: 'tatiana-shapovalova.jpg' },
  { name: 'Галина Лунина', slug: 'galina-lunina', image: 'galina-lunina.jpg' },
  { name: 'Надежда Миколюк', slug: 'nadiia-mykoliuk', image: 'nadiia-mykoliuk-bright.jpg' },
  { name: 'Наталья Маслова', slug: 'natalia-maslova', image: 'natalia-maslova-crop2.jpg' },
  { name: 'Наталья Ткаченко', slug: 'nataliia-tkachenko', image: 'nataliia-tkachenko.jpg' },
  { name: 'Нодзельская Алла', slug: 'nodzelska-alla', image: 'nodzelska-alla.jpg' },
  { name: 'Татьяна Стихарева', slug: 'tatiana-stikhareva', image: 'tatiana-stikhareva.jpg' },
  { name: 'Тамара Гусева', slug: 'tamara-guseva', image: 'tamara-guseva.jpg' },
  { name: 'Светлана Манич', slug: 'svetlana-manych', image: 'svetlana-manych.jpg' },
])

export const referralPartnerSlugs = Object.freeze(referralPartners.map(({ slug }) => slug))

export function findReferralPartner(slug) {
  return referralPartners.find((partner) => partner.slug === slug) || null
}
