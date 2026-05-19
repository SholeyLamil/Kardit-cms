export type Customer = {
  fullName: string
  phone: string
  email?: string
  state: string
  bvn: string
  street: string
  lga: string
  nin?: string
}

export type Bank = { id: string; code: string; name: string; sub: string }
export type Product = {
  id: string
  name: string
  style: 'standard' | 'gold' | 'platinum' | 'usd'
  currency: 'NGN' | 'USD'
  fee: string
  limits: string
}
export type CardType = 'VIRTUAL' | 'PHYSICAL'

export type Delivery = {
  method: 'Direct dispatch' | 'Courier' | 'Branch pickup'
  useDefault: boolean
  altStreet: string | null
  altLga: string | null
  altState: string | null
  notes: string | null
}

export type IssuanceOutcome = {
  cardId: string
  maskedPan: string
  expiryMonth: string
  expiryYear: string
  status: 'ACTIVE' | 'PERSONALIZING'
  virtualAccount: { virtualAccountId: string; status: 'ACTIVE' }
  createdAt: string
}

export const KNOWN_CUSTOMERS: Record<string, Customer> = {
  'CUST-2026-00345': {
    fullName: 'Adaeze Ngozi Okafor', phone: '+234 803 555 0142',
    email: 'adaeze.okafor@example.com', state: 'Lagos', bvn: '22123456789',
    street: '14 Bourdillon Road, Ikoyi', lga: 'Eti-Osa',
  },
  'CUST-2026-00344': {
    fullName: 'Tunde Akinwale Bakare', phone: '+234 805 442 0098',
    email: 'tunde.bakare@example.com', state: 'Lagos', bvn: '22198765432',
    street: '27 Awolowo Road, Ikoyi', lga: 'Eti-Osa',
  },
  'CUST-2026-00343': {
    fullName: 'Chiamaka Eze', phone: '+234 807 332 5511',
    email: 'chiamaka.eze@example.com', state: 'Lagos', bvn: '22155443322',
    street: '5 Adeola Odeku Street, VI', lga: 'Eti-Osa',
  },
}

export const BANKS: Bank[] = [
  { id: 'BNK-ZEN-002', code: 'zenith', name: 'Zenith Bank', sub: 'Most popular · Verve' },
  { id: 'BNK-GTB-001', code: 'gtbank', name: 'GTBank',      sub: 'Verve, Mastercard' },
  { id: 'BNK-ACC-005', code: 'access', name: 'Access Bank', sub: 'Verve, USD products' },
  { id: 'BNK-UBA-003', code: 'uba',    name: 'UBA',         sub: 'Verve, AfriCard' },
  { id: 'BNK-FCM-004', code: 'fcmb',   name: 'FCMB',        sub: 'Verve' },
]

export const PRODUCTS: Record<string, Product[]> = {
  'BNK-ZEN-002': [
    { id: 'PRD-ZEN-VRV-STD-01', name: 'Verve Prepaid Standard', style: 'standard', currency: 'NGN', fee: 'Issuance ₦1,000 · Maintenance ₦100/mo',   limits: 'Daily ₦200,000 · Monthly ₦1,000,000' },
    { id: 'PRD-ZEN-VRV-GLD-01', name: 'Verve Gold',             style: 'gold',     currency: 'NGN', fee: 'Issuance ₦5,000 · Maintenance ₦500/mo',   limits: 'Daily ₦1,000,000 · Monthly ₦5,000,000' },
    { id: 'PRD-ZEN-VIR-USD-01', name: 'Verve USD Virtual',      style: 'usd',      currency: 'USD', fee: 'Issuance $2 · Maintenance $1/mo',         limits: 'Daily $2,000 · Monthly $10,000' },
  ],
  'BNK-GTB-001': [
    { id: 'PRD-GTB-VRV-STD-01', name: 'Verve Prepaid Standard', style: 'standard', currency: 'NGN', fee: 'Issuance ₦1,500 · Maintenance ₦100/mo',   limits: 'Daily ₦200,000 · Monthly ₦1,000,000' },
    { id: 'PRD-GTB-VRV-PLT-01', name: 'Verve Platinum',         style: 'platinum', currency: 'NGN', fee: 'Issuance ₦10,000 · Maintenance ₦1,000/mo', limits: 'Daily ₦5,000,000 · Monthly ₦20,000,000' },
  ],
  'BNK-ACC-005': [
    { id: 'PRD-ACC-VRV-STD-01', name: 'Verve Prepaid Standard', style: 'standard', currency: 'NGN', fee: 'Issuance ₦1,000 · Maintenance ₦100/mo',   limits: 'Daily ₦200,000 · Monthly ₦1,000,000' },
    { id: 'PRD-ACC-VIR-USD-01', name: 'Access USD Virtual',     style: 'usd',      currency: 'USD', fee: 'Issuance $5 · Maintenance $1.50/mo',      limits: 'Daily $2,500 · Monthly $15,000' },
  ],
  'BNK-UBA-003': [
    { id: 'PRD-UBA-VRV-STD-01', name: 'Verve Prepaid Standard', style: 'standard', currency: 'NGN', fee: 'Issuance ₦1,000 · Maintenance ₦100/mo',   limits: 'Daily ₦200,000 · Monthly ₦1,000,000' },
    { id: 'PRD-UBA-AFR-USD-01', name: 'AfriCard USD',           style: 'usd',      currency: 'USD', fee: 'Issuance $3 · Maintenance $1/mo',         limits: 'Daily $2,000 · Monthly $10,000' },
  ],
  'BNK-FCM-004': [
    { id: 'PRD-FCM-VRV-STD-01', name: 'Verve Prepaid Standard', style: 'standard', currency: 'NGN', fee: 'Issuance ₦1,500 · Maintenance ₦150/mo',   limits: 'Daily ₦200,000 · Monthly ₦1,000,000' },
  ],
}

export const findBank = (id?: string) => BANKS.find((b) => b.id === id) ?? null
export const findProduct = (bankId?: string, productId?: string) =>
  (PRODUCTS[bankId ?? ''] ?? []).find((p) => p.id === productId) ?? null

export const genIdempotencyKey = () =>
  'idem-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36)
export const genRequestId = () =>
  'REQ-ISS-' + String(128 + Math.floor(Math.random() * 900)).padStart(6, '0')
export const genCardId = () =>
  'CARD-2026-' + String(1000 + Math.floor(Math.random() * 9000)).padStart(6, '0')
export const genCustomerId = () =>
  'CUST-2026-' + String(346 + Math.floor(Math.random() * 50)).padStart(5, '0')
export const genVaId = () =>
  'VA-2026-' + String(81 + Math.floor(Math.random() * 200)).padStart(5, '0')
export const maskPan = () => {
  const bin = ['411111', '522222', '506099', '539923'][Math.floor(Math.random() * 4)]
  const last4 = String(1000 + Math.floor(Math.random() * 9000))
  return `${bin}******${last4}`
}
export const maskBvn = (bvn?: string) =>
  (bvn ?? '').replace(/^(\d{3})\d{6}(\d{2})$/, '$1******$2') || '—'
