export type LoadableCard = {
  id: string
  maskedPan: string
  expiry: string
  product: string
  bank: string
  bankCode: string
  customer: string
  customerRef: string
}

export const LOADABLE_CARDS: LoadableCard[] = [
  { id: 'CARD-2026-VRP01029', maskedPan: '5061 ** ** ** 4421', expiry: '10/29', product: 'Verve Prepaid Standard', bank: 'Zenith Bank',  bankCode: 'BNK-ZEN-002', customer: 'Tunde Bakare',   customerRef: 'CUST-2026-00344' },
  { id: 'CARD-2026-VRP01028', maskedPan: '5061 ** ** ** 0091', expiry: '12/29', product: 'Verve Prepaid Standard', bank: 'Zenith Bank',  bankCode: 'BNK-ZEN-002', customer: 'Chiamaka Eze',   customerRef: 'CUST-2026-00343' },
  { id: 'CARD-2026-VRP00984', maskedPan: '5061 ** ** ** 7732', expiry: '06/28', product: 'Verve Prepaid Standard', bank: 'GTBank',       bankCode: 'BNK-GTB-001', customer: 'Chiamaka Eze',   customerRef: 'CUST-2026-00343' },
  { id: 'CARD-2026-VRP00973', maskedPan: '5061 ** ** ** 5566', expiry: '08/29', product: 'Verve Prepaid Standard', bank: 'Access Bank',  bankCode: 'BNK-ACC-003', customer: 'Ngozi Anyanwu',  customerRef: 'CUST-2026-00341' },
]

export const FUND_PROOF_TYPES = [
  { value: 'BANK_TRANSFER_CONFIRMED', label: 'Bank transfer confirmed', sub: 'Customer transferred to VA · transfer reference required' },
  { value: 'INTERNAL_FUND_MOVE',      label: 'Internal fund move',       sub: 'Affiliate-pool to VA · internal reference required' },
  { value: 'VA_DIRECT_CREDIT',        label: 'Virtual account credit',  sub: 'Direct credit into VA from issuing bank' },
] as const

export type ProofType = typeof FUND_PROOF_TYPES[number]['value']

export const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000] as const

export const findLoadCard = (id?: string | null) =>
  LOADABLE_CARDS.find((c) => c.id === id) ?? null

export const proofTypeLabel = (v: ProofType | string | undefined) =>
  FUND_PROOF_TYPES.find((p) => p.value === v)?.label ?? v ?? '—'

export const fmtNaira = (n: number) =>
  '₦' + Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function fmtTime(iso: string | null | undefined) {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export const genReqId = () =>
  'REQ-LOAD-' + String(40 + Math.floor(Math.random() * 999)).padStart(5, '0')
export const genIdem = () =>
  'idem-load-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36)
export const genTxnId = () =>
  'TXN-LOAD-' + String(7821 + Math.floor(Math.random() * 9999)).padStart(7, '0')
export const genCmsRef = () =>
  'CMS-FUND-' + String(881000 + Math.floor(Math.random() * 9999)).padStart(7, '0')
