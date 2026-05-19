export type KycLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
export type CustomerStatus = 'DRAFT' | 'ACTIVE' | 'FROZEN'
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'TERMINATED'
export type CardKind = 'VIRTUAL' | 'PHYSICAL'

export type LinkedCard = {
  id: string
  maskedPan: string
  expiry: string
  product: string
  productCode: string
  bank: string
  bankCode: string
  type: CardKind
  status: CardStatus
  createdAt: string
}

export type CustomerRecord = {
  ref: string
  title: string | null
  firstName: string
  middleName: string | null
  lastName: string
  dob: string
  gender: 'Male' | 'Female' | null
  nationality: string | null
  phone: string
  phoneAlt: string | null
  email: string | null
  street: string
  lga: string
  state: string
  country: string
  postcode: string | null
  bvn: string
  nin: string | null
  idType: 'passport' | 'drivers' | 'voters' | null
  idNumber: string | null
  kycLevel: KycLevel
  verifiedAt: string | null
  status: CustomerStatus
  createdAt: string
  capturedBy: string
  cards: LinkedCard[]
}

export const CUSTOMERS: CustomerRecord[] = [
  {
    ref: 'CUST-2026-00345',
    title: 'Mrs', firstName: 'Adaeze', middleName: 'Ngozi', lastName: 'Okafor',
    dob: '1991-08-14', gender: 'Female', nationality: 'Nigerian',
    phone: '+234 803 555 0142', phoneAlt: null, email: 'adaeze.okafor@example.com',
    street: '14 Bourdillon Road, Ikoyi', lga: 'Eti-Osa', state: 'Lagos',
    country: 'Nigeria', postcode: '101233',
    bvn: '22123456789', nin: '98765432101', idType: 'passport', idNumber: 'A12345678',
    kycLevel: 'LEVEL_2', verifiedAt: null,
    status: 'DRAFT', createdAt: '2026-05-11T09:42:00Z', capturedBy: 'Adaeze O.',
    cards: [],
  },
  {
    ref: 'CUST-2026-00344',
    title: 'Mr', firstName: 'Tunde', middleName: null, lastName: 'Bakare',
    dob: '1985-03-22', gender: 'Male', nationality: 'Nigerian',
    phone: '+234 805 123 4567', phoneAlt: '+234 814 992 0188', email: 'tunde.bakare@example.com',
    street: '27 Adeola Odeku Street, Victoria Island', lga: 'Eti-Osa', state: 'Lagos',
    country: 'Nigeria', postcode: '101241',
    bvn: '22087654321', nin: null, idType: 'drivers', idNumber: 'LSD-2019-44192',
    kycLevel: 'LEVEL_2', verifiedAt: '2026-05-10T15:00:00Z',
    status: 'ACTIVE', createdAt: '2026-05-10T14:21:00Z', capturedBy: 'Adaeze O.',
    cards: [{
      id: 'CARD-2026-VRP01029', maskedPan: '5061 ** ** ** 4421', expiry: '10/29',
      product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
      bank: 'Zenith Bank', bankCode: 'BNK-ZEN-002',
      type: 'VIRTUAL', status: 'ACTIVE', createdAt: '2026-05-10T14:30:00Z',
    }],
  },
  {
    ref: 'CUST-2026-00343',
    title: 'Mrs', firstName: 'Chiamaka', middleName: 'Adaobi', lastName: 'Eze',
    dob: '1989-04-15', gender: 'Female', nationality: 'Nigerian',
    phone: '+234 813 222 8800', phoneAlt: null, email: 'chiamaka.eze@example.com',
    street: '12 Bonny Camp Road, Apapa', lga: 'Apapa', state: 'Lagos',
    country: 'Nigeria', postcode: '101001',
    bvn: '22045678901', nin: '11122233344', idType: 'passport', idNumber: 'B98765432',
    kycLevel: 'LEVEL_3', verifiedAt: '2026-04-20T10:00:00Z',
    status: 'ACTIVE', createdAt: '2026-05-09T11:15:00Z', capturedBy: 'Folake A.',
    cards: [
      {
        id: 'CARD-2026-VRP01028', maskedPan: '5061 ** ** ** 0091', expiry: '12/29',
        product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
        bank: 'Zenith Bank', bankCode: 'BNK-ZEN-002',
        type: 'VIRTUAL', status: 'ACTIVE', createdAt: '2026-05-09T11:25:00Z',
      },
      {
        id: 'CARD-2026-VRP00984', maskedPan: '5061 ** ** ** 7732', expiry: '06/28',
        product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
        bank: 'GTBank', bankCode: 'BNK-GTB-001',
        type: 'PHYSICAL', status: 'FROZEN', createdAt: '2026-04-15T09:30:00Z',
      },
    ],
  },
  {
    ref: 'CUST-2026-00342',
    title: 'Mr', firstName: 'Olumide', middleName: null, lastName: 'Adeyemi',
    dob: '1994-11-08', gender: 'Male', nationality: 'Nigerian',
    phone: '+234 802 944 2233', phoneAlt: null, email: null,
    street: 'Plot 3, Lekki Phase 1', lga: 'Eti-Osa', state: 'Lagos',
    country: 'Nigeria', postcode: '101245',
    bvn: '22019283746', nin: null, idType: null, idNumber: null,
    kycLevel: 'LEVEL_1', verifiedAt: null,
    status: 'DRAFT', createdAt: '2026-05-09T08:33:00Z', capturedBy: 'Adaeze O.',
    cards: [],
  },
  {
    ref: 'CUST-2026-00341',
    title: 'Ms', firstName: 'Ngozi', middleName: null, lastName: 'Anyanwu',
    dob: '1992-07-30', gender: 'Female', nationality: 'Nigerian',
    phone: '+234 818 110 3344', phoneAlt: null, email: 'ngozi.anyanwu@example.com',
    street: '5 Aminu Kano Crescent, Wuse 2', lga: 'Abuja Municipal', state: 'FC',
    country: 'Nigeria', postcode: '900288',
    bvn: '22056781234', nin: '55566677788', idType: 'voters', idNumber: 'VC-1029384',
    kycLevel: 'LEVEL_2', verifiedAt: '2026-05-08T16:00:00Z',
    status: 'ACTIVE', createdAt: '2026-05-08T15:21:00Z', capturedBy: 'Folake A.',
    cards: [{
      id: 'CARD-2026-VRP00973', maskedPan: '5061 ** ** ** 5566', expiry: '08/29',
      product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
      bank: 'Access Bank', bankCode: 'BNK-ACC-003',
      type: 'VIRTUAL', status: 'ACTIVE', createdAt: '2026-05-08T15:30:00Z',
    }],
  },
  {
    ref: 'CUST-2026-00340',
    title: 'Mr', firstName: 'Emeka', middleName: 'Chukwuemeka', lastName: 'Nwosu',
    dob: '1983-12-02', gender: 'Male', nationality: 'Nigerian',
    phone: '+234 803 887 1122', phoneAlt: null, email: 'emeka.nwosu@example.com',
    street: '18 Asa Afariogun, Ajao Estate', lga: 'Oshodi-Isolo', state: 'Lagos',
    country: 'Nigeria', postcode: '100263',
    bvn: '22099887766', nin: '44455566677', idType: 'passport', idNumber: 'A99887766',
    kycLevel: 'LEVEL_3', verifiedAt: '2026-03-10T12:00:00Z',
    status: 'ACTIVE', createdAt: '2026-05-06T10:18:00Z', capturedBy: 'Adaeze O.',
    cards: [{
      id: 'CARD-2026-VRP00921', maskedPan: '5061 ** ** ** 1142', expiry: '05/29',
      product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
      bank: 'Zenith Bank', bankCode: 'BNK-ZEN-002',
      type: 'VIRTUAL', status: 'ACTIVE', createdAt: '2026-05-06T10:30:00Z',
    }],
  },
  {
    ref: 'CUST-2026-00339',
    title: 'Mrs', firstName: 'Folake', middleName: null, lastName: 'Adesanya',
    dob: '1987-06-19', gender: 'Female', nationality: 'Nigerian',
    phone: '+234 806 442 9912', phoneAlt: null, email: 'folake.adesanya@example.com',
    street: '44 Allen Avenue, Ikeja', lga: 'Ikeja', state: 'Lagos',
    country: 'Nigeria', postcode: '100271',
    bvn: '22033445566', nin: '77788899900', idType: 'drivers', idNumber: 'LSD-2018-99812',
    kycLevel: 'LEVEL_2', verifiedAt: '2026-05-04T14:00:00Z',
    status: 'FROZEN', createdAt: '2026-05-04T13:42:00Z', capturedBy: 'Folake A.',
    cards: [{
      id: 'CARD-2026-VRP00874', maskedPan: '5061 ** ** ** 9912', expiry: '04/29',
      product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
      bank: 'GTBank', bankCode: 'BNK-GTB-001',
      type: 'VIRTUAL', status: 'FROZEN', createdAt: '2026-05-04T13:50:00Z',
    }],
  },
  {
    ref: 'CUST-2026-00338',
    title: 'Mr', firstName: 'Babatunde', middleName: null, lastName: 'Ojo',
    dob: '1990-02-25', gender: 'Male', nationality: 'Nigerian',
    phone: '+234 815 003 7788', phoneAlt: null, email: 'babatunde.ojo@example.com',
    street: '9 Marina Road, Lagos Island', lga: 'Lagos Island', state: 'Lagos',
    country: 'Nigeria', postcode: '101231',
    bvn: '22011223344', nin: '33344455566', idType: 'voters', idNumber: 'VC-9988776',
    kycLevel: 'LEVEL_2', verifiedAt: '2026-05-03T11:00:00Z',
    status: 'ACTIVE', createdAt: '2026-05-03T10:42:00Z', capturedBy: 'Adaeze O.',
    cards: [{
      id: 'CARD-2026-VRP00812', maskedPan: '5061 ** ** ** 7788', expiry: '03/29',
      product: 'Verve Prepaid Standard', productCode: 'PRD-PREPAID-001',
      bank: 'Access Bank', bankCode: 'BNK-ACC-003',
      type: 'VIRTUAL', status: 'ACTIVE', createdAt: '2026-05-03T11:00:00Z',
    }],
  },
]

export const findCustomer = (ref?: string | null) =>
  CUSTOMERS.find((c) => c.ref === ref) ?? null

export const customerFullName = (c: CustomerRecord) =>
  [c.firstName, c.middleName, c.lastName].filter(Boolean).join(' ')

export const customerInitials = (c: CustomerRecord) =>
  (c.firstName[0] ?? '') + (c.lastName[0] ?? '')

export const maskBvn = (b: string | null | undefined) =>
  b ? b.slice(0, 3) + '******' + b.slice(-2) : '—'

export function formatDate(iso: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(
    'en-GB',
    opts ?? { day: '2-digit', month: 'short', year: 'numeric' },
  )
}

export function relativeTime(iso: string | null) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`
  return formatDate(iso)
}

export const idTypeLabel = (t: string | null) => {
  if (!t) return null
  return ({
    passport: 'International Passport',
    drivers: "Driver's License",
    voters: "Voter's Card",
  } as Record<string, string>)[t] ?? t
}
