import { CUSTOMERS, customerFullName, type LinkedCard } from '../customers/data'

export type CardStatus = 'ACTIVE' | 'FROZEN' | 'TERMINATED'

export type Owner = {
  ref: string
  fullName: string
  phone: string
}

export type ResolvedCard = LinkedCard & {
  lastChangedAt: string | null
  cmsRef: string | null
  owner: Owner
}

export const FREEZE_REASONS = [
  { value: 'CUSTOMER_REQUEST', label: 'Customer request' },
  { value: 'SUSPECTED_FRAUD',  label: 'Suspected fraud' },
  { value: 'CARD_LOST_STOLEN', label: 'Card lost / stolen' },
  { value: 'COMPLIANCE_HOLD',  label: 'Compliance hold' },
  { value: 'INTERNAL_REVIEW',  label: 'Internal review' },
] as const

export const UNFREEZE_REASONS = [
  { value: 'ISSUE_RESOLVED',     label: 'Issue resolved' },
  { value: 'FALSE_FLAG',         label: 'False flag — fraud not confirmed' },
  { value: 'CUSTOMER_REQUEST',   label: 'Customer request' },
  { value: 'COMPLIANCE_CLEARED', label: 'Compliance review cleared' },
] as const

export function mockBalance(cardId: string) {
  let h = 0
  for (let i = 0; i < cardId.length; i++) h = ((h << 5) - h + cardId.charCodeAt(i)) | 0
  const seed = Math.abs(h)
  const ledger = 50000 + (seed % 450000)
  const reserved = seed % 5000
  return {
    ledgerBalance: ledger,
    availableBalance: ledger - reserved,
    currency: 'NGN' as const,
  }
}

type TxnRow = { type: 'in' | 'out'; merchant: string; category: string; amount: number }

export function mockTxns(cardId: string): TxnRow[] {
  const seed = cardId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const pool: TxnRow[] = [
    { type: 'out', merchant: 'Chowdeck',    category: 'Food delivery',  amount: -3500 },
    { type: 'out', merchant: 'Bolt',        category: 'Transport',      amount: -2200 },
    { type: 'in',  merchant: 'Funding',     category: 'Affiliate load', amount:  50000 },
    { type: 'out', merchant: 'Spar Lekki',  category: 'Groceries',      amount: -18450 },
    { type: 'out', merchant: 'Netflix',     category: 'Subscription',   amount: -4500 },
  ]
  const count = 3 + (seed % 3)
  return pool.slice(0, count)
}

export function fmtAmount(amt: number, currency: 'NGN' | 'USD') {
  const sign = amt < 0 ? '-' : ''
  const sym = currency === 'USD' ? '$' : '₦'
  return sign + sym + Math.abs(amt).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtMoneyPlain(amt: number, currency: 'NGN' | 'USD') {
  const sym = currency === 'USD' ? '$' : '₦'
  return sym + amt.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function fmtTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export const genCmsRef = (prefix: string) =>
  prefix + '-' + String(8821000 + Math.floor(Math.random() * 9999)).padStart(7, '0')
export const genReqId = (prefix: string) =>
  prefix + '-' + String(20 + Math.floor(Math.random() * 999)).padStart(5, '0')
export const genIdemKey = (prefix: string) =>
  prefix + '-idem-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36)

/* All cards across customers, indexed by cardId */
type CardIndexEntry = { card: LinkedCard; owner: Owner }
const _index: Record<string, CardIndexEntry> = {}
for (const c of CUSTOMERS) {
  const owner: Owner = { ref: c.ref, fullName: customerFullName(c), phone: c.phone }
  for (const card of c.cards) {
    _index[card.id] = { card, owner }
  }
}

export function findSeedCard(cardId: string): CardIndexEntry | null {
  return _index[cardId] ?? null
}
