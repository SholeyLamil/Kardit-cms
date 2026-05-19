import { findSeedCard, type ResolvedCard, type Owner } from './data'
import { getOverride } from './overrideStorage'
import type { LinkedCard } from '../customers/data'

const ISSUE_CARD_STATE_KEY = 'kardit_iss_state_v1'

type IssuanceSession = {
  customerId?: string
  customer?: { fullName?: string; phone?: string }
  bankId?: string
  productType?: 'VIRTUAL' | 'PHYSICAL'
  outcome?: {
    cardId: string
    maskedPan: string
    expiryMonth: string
    expiryYear: string
    status: 'ACTIVE' | 'PERSONALIZING'
    createdAt: string
  }
}

function readIssuance(): IssuanceSession {
  try {
    return JSON.parse(sessionStorage.getItem(ISSUE_CARD_STATE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function findCard(cardId: string): ResolvedCard | null {
  const seed = findSeedCard(cardId)
  if (seed) {
    const ov = getOverride(cardId)
    return {
      ...seed.card,
      status: ov.status ?? seed.card.status,
      lastChangedAt: ov.changedAt ?? null,
      cmsRef: ov.cmsRef ?? null,
      owner: seed.owner,
    }
  }
  const iss = readIssuance()
  if (iss.outcome?.cardId === cardId && iss.customerId) {
    const ov = getOverride(cardId)
    const card: LinkedCard = {
      id: iss.outcome.cardId,
      maskedPan: iss.outcome.maskedPan,
      expiry: `${iss.outcome.expiryMonth}/${iss.outcome.expiryYear}`,
      product: 'Verve Prepaid Standard',
      productCode: 'PRD-PREPAID-001',
      bank: 'Zenith Bank',
      bankCode: iss.bankId ?? 'BNK-ZEN-002',
      type: iss.productType ?? 'VIRTUAL',
      status: (ov.status ?? (iss.outcome.status === 'PERSONALIZING' ? 'ACTIVE' : iss.outcome.status)),
      createdAt: iss.outcome.createdAt,
    }
    const owner: Owner = {
      ref: iss.customerId,
      fullName: iss.customer?.fullName ?? 'Recently captured customer',
      phone: iss.customer?.phone ?? '',
    }
    return {
      ...card,
      lastChangedAt: ov.changedAt ?? null,
      cmsRef: ov.cmsRef ?? null,
      owner,
    }
  }
  return null
}
