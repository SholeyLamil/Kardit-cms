import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type StepId = 'org' | 'docs' | 'banks' | 'review' | 'status'

export type FormData = {
  legalName: string
  regNo: string
  tin: string
  address: string
  country: string
  industry: string
  contactName: string
  contactRole: string
  email: string
  phone: string
}

export type DocFile = { name: string; size: string } | null
export type DocsState = Record<'cac' | 'memart' | 'tin' | 'directors' | 'utility', DocFile>

export type Confirmed = { terms: boolean; contact: boolean }

export type StatusStage = 'submitted' | 'review' | 'clarification' | 'approved'

export type OnboardingState = {
  formData: FormData
  docs: DocsState
  banks: string[]
  confirmed: Confirmed
  caseId: string
  statusStage: StatusStage
}

const DEFAULT_FORM: FormData = {
  legalName: 'Acme Microfinance Bank Ltd',
  regNo: 'RC 1234567',
  tin: '0000000-0001',
  address: '14b Adeola Odeku, Victoria Island, Lagos',
  country: 'Nigeria',
  industry: 'Microfinance',
  contactName: 'Adaeze Okafor',
  contactRole: 'Head of Operations',
  email: 'adaeze@acme.ng',
  phone: '+234 803 000 0000',
}

const DEFAULT_DOCS: DocsState = {
  cac: null,
  memart: null,
  tin: null,
  directors: null,
  utility: null,
}

const DEFAULT_STATE: OnboardingState = {
  formData: DEFAULT_FORM,
  docs: DEFAULT_DOCS,
  banks: [],
  confirmed: { terms: false, contact: false },
  caseId: 'KAR-2026-04-0431',
  statusStage: 'clarification',
}

const STORAGE_KEY = 'kardit_onboarding_v1'

type Ctx = {
  state: OnboardingState
  setFormData: (f: FormData) => void
  setDocs: (d: DocsState) => void
  setBanks: (b: string[]) => void
  setConfirmed: (c: Confirmed) => void
  setStatusStage: (s: StatusStage) => void
  reset: () => void
}

const OnboardingCtx = createContext<Ctx | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) }
    } catch {
      // ignore
    }
    return DEFAULT_STATE
  })

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const setFormData = useCallback((f: FormData) => setState((s) => ({ ...s, formData: f })), [])
  const setDocs = useCallback((d: DocsState) => setState((s) => ({ ...s, docs: d })), [])
  const setBanks = useCallback((b: string[]) => setState((s) => ({ ...s, banks: b })), [])
  const setConfirmed = useCallback((c: Confirmed) => setState((s) => ({ ...s, confirmed: c })), [])
  const setStatusStage = useCallback((stage: StatusStage) => setState((s) => ({ ...s, statusStage: stage })), [])
  const reset = useCallback(() => {
    window.sessionStorage.removeItem(STORAGE_KEY)
    setState(DEFAULT_STATE)
  }, [])

  return (
    <OnboardingCtx.Provider value={{ state, setFormData, setDocs, setBanks, setConfirmed, setStatusStage, reset }}>
      {children}
    </OnboardingCtx.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingCtx)
  if (!ctx) throw new Error('useOnboarding outside OnboardingProvider')
  return ctx
}

export const STEPS: { id: StepId; n: number; label: string; meta: string; path: string }[] = [
  { id: 'org',    n: 1, label: 'Organization & Contact', meta: 'Tell us about your business',  path: '/onboarding/org' },
  { id: 'docs',   n: 2, label: 'KYB / KYC Documents',    meta: 'Upload required documents',    path: '/onboarding/docs' },
  { id: 'banks',  n: 3, label: 'Issuing Banks',          meta: 'Select your banking partners', path: '/onboarding/banks' },
  { id: 'review', n: 4, label: 'Review & Submit',        meta: 'Confirm and send for approval', path: '/onboarding/review' },
  { id: 'status', n: 5, label: 'Status & Tracking',      meta: 'Track your application',        path: '/onboarding/status' },
]
