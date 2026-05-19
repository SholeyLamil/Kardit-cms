export type Health = 'l2' | 'l1' | 'l0'

export type Affiliate = {
  tenantId: string
  name: string
  onboarded: string
  cardsIssued: number
  active: number
  fundingToday: string
  health: Health
  healthLabel: string
}

export const BANK = {
  code: 'BNK-ZEN-002',
  name: 'Zenith Bank',
  shortName: 'ZEN',
  cardsLive: '15,247',
  affiliates: 12,
}

export const AFFILIATES: Affiliate[] = [
  { tenantId: 'TNT-AFF-10291', name: 'Kardit Lagos',      onboarded: 'Onboarded Feb 2025', cardsIssued: 1247, active: 1089, fundingToday: '₦18.4M', health: 'l2', healthLabel: 'Healthy' },
  { tenantId: 'TNT-AFF-10302', name: 'Paystream Abuja',   onboarded: 'Onboarded Mar 2025', cardsIssued: 3401, active: 3118, fundingToday: '₦42.8M', health: 'l2', healthLabel: 'Healthy' },
  { tenantId: 'TNT-AFF-10118', name: 'FCMB Microfinance', onboarded: 'Onboarded Jan 2025', cardsIssued: 5892, active: 5401, fundingToday: '₦62.1M', health: 'l2', healthLabel: 'Healthy' },
  { tenantId: 'TNT-AFF-10358', name: 'Naija Pay Co.',     onboarded: 'Onboarded Apr 2025', cardsIssued: 2103, active: 1892, fundingToday: '₦11.3M', health: 'l1', healthLabel: 'Watch' },
  { tenantId: 'TNT-AFF-10501', name: 'Stellar Wallet',    onboarded: 'Onboarded Feb 2026', cardsIssued:  421, active:  389, fundingToday: '₦4.2M',  health: 'l2', healthLabel: 'Healthy' },
  { tenantId: 'TNT-AFF-10422', name: 'RemiPay',           onboarded: 'Onboarded May 2025', cardsIssued: 2183, active: 2003, fundingToday: '₦3.8M',  health: 'l0', healthLabel: 'Low activity' },
]

export const KPI = {
  cardsIssued: '15,247',
  active: '13,892',
  activeSub: '91.1% of issued',
  frozen: '412',
  frozenSub: '2.7% of issued',
  terminated: '943',
  terminatedSub: 'retired this year',
  funding: '₦142.6M',
  unload: '₦18.4M',
  txnVol: '₦384.2M',
  pendingMc: '8',
  failedCms: '23',
  failedSub: '14 timeouts · 6 signature mismatches · 3 token24 expired',
  generatedAt: '11 May 2026, 18:42',
}
