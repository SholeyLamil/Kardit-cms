import {
  CreditCard, Shield, Wallet, ArrowDownCircle, List, Users, AlertCircle, Sliders,
  type LucideIcon,
} from 'lucide-react'

export type ReportDef = {
  id: string
  icon: LucideIcon
  name: string
  desc: string
  format: string
}

export const REPORTS: ReportDef[] = [
  {
    id: 'issuance',
    icon: CreditCard,
    name: 'Card Issuance Report',
    desc: 'Issuance volumes by bank, product, and type. Virtual account provisioning success rate.',
    format: 'CSV / XLSX',
  },
  {
    id: 'status',
    icon: Shield,
    name: 'Card Status Report',
    desc: 'Snapshot of card statuses across the tenant — Active, Frozen, Terminated, Personalizing.',
    format: 'CSV / XLSX',
  },
  {
    id: 'funding',
    icon: Wallet,
    name: 'Funding Transactions Report',
    desc: 'All FundingTransaction entries — final states only. Excludes reversed loads.',
    format: 'CSV / XLSX',
  },
  {
    id: 'unload',
    icon: ArrowDownCircle,
    name: 'Unload Transactions Report',
    desc: 'All unload / transfer-out transactions completed within the date range.',
    format: 'CSV / XLSX',
  },
  {
    id: 'txns',
    icon: List,
    name: 'Card Transaction Report',
    desc: 'Card spend, authorisations, and reversals. Filter by status and amount range.',
    format: 'CSV / XLSX',
  },
  {
    id: 'mc',
    icon: Users,
    name: 'Pending Maker–Checker Report',
    desc: 'Open approvals waiting for a checker. Use to spot stuck items.',
    format: 'CSV / XLSX',
  },
  {
    id: 'cms',
    icon: AlertCircle,
    name: 'Failed CMS Requests Report',
    desc: 'CMS calls that failed and the platform retry outcome. From CMSRequestLog.',
    format: 'CSV / XLSX',
  },
  {
    id: 'limits',
    icon: Sliders,
    name: 'Limit Change Requests Report',
    desc: 'All limit-increase requests with their approval/decision history.',
    format: 'CSV / XLSX',
  },
]

export const RANGES = [
  { v: 'today', l: 'Today' },
  { v: 'week', l: 'Last 7 days' },
  { v: 'month', l: 'Last 30 days' },
  { v: 'last_month', l: 'Last month' },
  { v: 'quarter', l: 'This quarter' },
  { v: 'custom', l: 'Custom range…' },
] as const

export type RecentReport = {
  name: string
  range: string
  ts: string
}

export const RECENT_REPORTS: RecentReport[] = [
  { name: 'Card Issuance Report · 2026-05-01 → 2026-05-10', range: 'XLSX · 248 KB', ts: 'Yesterday, 18:02' },
  { name: 'Funding Transactions Report · 2026-05-01 → 2026-05-08', range: 'CSV · 38.1 KB', ts: '2 days ago' },
  { name: 'Card Transaction Report · April 2026', range: 'XLSX · 1.4 MB', ts: '5 days ago' },
  { name: 'Pending Maker–Checker Report · 2026 W17', range: 'CSV · 12.4 KB', ts: '1 week ago' },
]

export function newJobId(): string {
  return `REQ-RPT-${Math.floor(Math.random() * 9000) + 1000}`
}
