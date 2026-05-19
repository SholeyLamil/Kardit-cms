import type { CardStatus } from './data'

export type Override = {
  status?: CardStatus
  changedAt?: string
  cmsRef?: string
  reason?: string
}

const KEY = 'kardit_card_overrides_v1'

function readAll(): Record<string, Override> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

export function getOverride(cardId: string): Override {
  return readAll()[cardId] ?? {}
}

export function setOverride(cardId: string, patch: Override) {
  const all = readAll()
  all[cardId] = { ...(all[cardId] ?? {}), ...patch }
  sessionStorage.setItem(KEY, JSON.stringify(all))
}
