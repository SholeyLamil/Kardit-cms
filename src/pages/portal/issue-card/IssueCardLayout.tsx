import { Outlet, useLocation, Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { IssueCardProvider, useIssueCard } from './IssueCardContext'

type Step = { num: number; id: string; label: string; path: string }

const STEPS: Step[] = [
  { num: 1, id: 'customer', label: 'Customer', path: '/portal/issue-card/customer' },
  { num: 2, id: 'card',     label: 'Card',     path: '/portal/issue-card/card' },
  { num: 3, id: 'delivery', label: 'Delivery', path: '/portal/issue-card/delivery' },
  { num: 4, id: 'review',   label: 'Review',   path: '/portal/issue-card/review' },
  { num: 5, id: 'result',   label: 'Result',   path: '/portal/issue-card/result' },
]

function activeStepFromPath(pathname: string): number {
  const tail = pathname.replace(/^\/portal\/issue-card\/?/, '')
  const i = STEPS.findIndex((s) => s.id === tail)
  return i >= 0 ? i + 1 : 0
}

function HStepper({ activeStep }: { activeStep: number }) {
  const { state } = useIssueCard()
  const isVirtual = state.productType === 'VIRTUAL'

  if (activeStep === 0) return null

  return (
    <nav className="hstepper" aria-label="Issuance flow">
      {STEPS.map((s) => {
        const isActive = s.num === activeStep
        const isDone = s.num < activeStep
        const isSkipped = s.id === 'delivery' && isVirtual && !!state.productType
        const cls = ['hstep',
          isActive && 'is-active',
          isDone && 'is-done',
          isSkipped && 'is-skipped',
        ].filter(Boolean).join(' ')
        const circle = isDone ? <Check /> : isSkipped ? '—' : s.num
        const inner = (
          <>
            <span className="hstep__circle">{circle}</span>
            <span>
              {s.label}
              {isSkipped && <span style={{ fontSize: 9, opacity: 0.6 }}> (virtual)</span>}
            </span>
          </>
        )
        return isSkipped ? (
          <span key={s.id} className={cls}>{inner}</span>
        ) : (
          <Link key={s.id} className={cls} to={s.path}>{inner}</Link>
        )
      })}
    </nav>
  )
}

function InnerLayout() {
  const { pathname } = useLocation()
  const step = activeStepFromPath(pathname)
  return (
    <>
      <HStepper activeStep={step} />
      <Outlet />
    </>
  )
}

export default function IssueCardLayout() {
  return (
    <IssueCardProvider>
      <InnerLayout />
    </IssueCardProvider>
  )
}
