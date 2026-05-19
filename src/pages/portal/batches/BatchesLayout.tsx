import { Link, Outlet, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { STEPS } from './data'

function activeStepFor(pathname: string): number {
  if (pathname.endsWith('/upload')) return 2
  if (pathname.endsWith('/validation')) return 3
  if (pathname.endsWith('/submit')) return 4
  if (pathname.endsWith('/approval')) return 5
  if (pathname.endsWith('/processing')) return 6
  if (pathname.endsWith('/result')) return 7
  if (pathname.endsWith('/welcome')) return 0 // welcome page hides stepper
  return 1 // dashboard
}

export default function BatchesLayout() {
  const { pathname } = useLocation()
  const active = activeStepFor(pathname)
  const showStepper = active > 0

  return (
    <>
      {showStepper && (
        <nav className="hstepper" aria-label="Batch issuance flow">
          {STEPS.map((s) => {
            const isActive = s.num === active
            const isDone = s.num < active
            const cls = ['hstep', isActive && 'is-active', isDone && 'is-done'].filter(Boolean).join(' ')
            const actorCls = s.actor === 'Checker' ? 'hstep__actor checker' : 'hstep__actor'
            return (
              <Link key={s.id} className={cls} to={s.path}>
                <span className="hstep__circle">{isDone ? <Check /> : s.num}</span>
                <span>{s.label}</span>
                <span className={actorCls}>{s.actor}</span>
              </Link>
            )
          })}
        </nav>
      )}
      <Outlet />
    </>
  )
}
