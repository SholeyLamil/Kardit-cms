import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { LoadableCard, ProofType } from './data'

export type FundingReference = {
  virtualAccountNumber: string
  bankId: string
  bankTransferReference: string
  proofType: ProofType
}

export type LoadOutcome = {
  txnId: string
  approvedBy: string
  approvedAt: string
  cmsRef: string
  balance: number
}

export type LoadFundsState = {
  card?: LoadableCard
  amount?: number
  reference?: string | null
  fundingReference?: FundingReference
  reqId?: string
  idem?: string
  outcome?: LoadOutcome
}

const KEY = 'kardit_load_state_v1'

function readSession(): LoadFundsState {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') } catch { return {} }
}
function writeSession(s: LoadFundsState) {
  sessionStorage.setItem(KEY, JSON.stringify(s))
}

type Ctx = {
  state: LoadFundsState
  patch: (p: Partial<LoadFundsState>) => void
  reset: () => void
}

const LoadFundsCtx = createContext<Ctx | null>(null)

export function LoadFundsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LoadFundsState>(() => readSession())

  useEffect(() => { writeSession(state) }, [state])

  const patch = useCallback((p: Partial<LoadFundsState>) => {
    setState((cur) => ({ ...cur, ...p }))
  }, [])

  const reset = useCallback(() => {
    sessionStorage.removeItem(KEY)
    setState({})
  }, [])

  return (
    <LoadFundsCtx.Provider value={{ state, patch, reset }}>
      {children}
    </LoadFundsCtx.Provider>
  )
}

export function useLoadFunds() {
  const ctx = useContext(LoadFundsCtx)
  if (!ctx) throw new Error('useLoadFunds must be used inside LoadFundsProvider')
  return ctx
}
