import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Customer, CardType, Delivery, IssuanceOutcome } from './data'

export type IssueCardState = {
  customerId?: string
  customer?: Customer
  bankId?: string
  productId?: string
  productType?: CardType | null
  currency?: 'NGN' | 'USD'
  delivery?: Delivery
  idempotencyKey?: string
  requestId?: string
  outcome?: IssuanceOutcome
}

const STATE_KEY = 'kardit_iss_state_v1'

function readSession(): IssueCardState {
  try {
    return JSON.parse(sessionStorage.getItem(STATE_KEY) || '{}')
  } catch {
    return {}
  }
}
function writeSession(s: IssueCardState) {
  sessionStorage.setItem(STATE_KEY, JSON.stringify(s))
}

type Ctx = {
  state: IssueCardState
  patch: (p: Partial<IssueCardState>) => void
  reset: () => void
}

const IssueCardCtx = createContext<Ctx | null>(null)

export function IssueCardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<IssueCardState>(() => readSession())

  useEffect(() => {
    writeSession(state)
  }, [state])

  const patch = useCallback((p: Partial<IssueCardState>) => {
    setState((cur) => ({ ...cur, ...p }))
  }, [])

  const reset = useCallback(() => {
    sessionStorage.removeItem(STATE_KEY)
    setState({})
  }, [])

  return (
    <IssueCardCtx.Provider value={{ state, patch, reset }}>
      {children}
    </IssueCardCtx.Provider>
  )
}

export function useIssueCard() {
  const ctx = useContext(IssueCardCtx)
  if (!ctx) throw new Error('useIssueCard must be used inside IssueCardProvider')
  return ctx
}
