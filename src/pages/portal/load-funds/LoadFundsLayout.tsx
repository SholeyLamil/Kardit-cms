import { Outlet, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { LoadFundsProvider } from './LoadFundsContext'

const STEPS = [
  { num: 1, id: '', label: 'Form' },
  { num: 2, id: 'review', label: 'Review' },
  { num: 3, id: 'result', label: 'Result' },
]

function activeStep(pathname: string): number {
  const tail = pathname.replace(/^\/portal\/funds\/?/, '')
  if (tail === 'review') return 2
  if (tail === 'result') return 3
  return 1
}

function HStepper() {
  const { pathname } = useLocation()
  const step = activeStep(pathname)
  return (
    <nav className="hstepper" aria-label="Load funds flow">
      {STEPS.map((s) => {
        const isActive = s.num === step
        const isDone = s.num < step
        const cls = ['hstep',
          isActive && 'is-active',
          isDone && 'is-done',
        ].filter(Boolean).join(' ')
        return (
          <span key={s.num} className={cls}>
            <span className="hstep__circle">{isDone ? <Check /> : s.num}</span>
            <span>{s.label}</span>
          </span>
        )
      })}
    </nav>
  )
}

export default function LoadFundsLayout() {
  return (
    <LoadFundsProvider>
      <HStepper />
      <Outlet />
    </LoadFundsProvider>
  )
}
