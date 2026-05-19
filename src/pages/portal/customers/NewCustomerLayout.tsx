import { Outlet, useLocation, Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const STEPS = [
  { num: 1, id: '', label: 'Customer details', path: '/portal/customers/new' },
  { num: 2, id: 'saved', label: 'Saved', path: '/portal/customers/new/saved' },
]

function activeStepFromPath(pathname: string): number {
  if (pathname.endsWith('/saved')) return 2
  if (pathname.startsWith('/portal/customers/new')) return 1
  return 0
}

export default function NewCustomerLayout() {
  const { pathname } = useLocation()
  const activeStep = activeStepFromPath(pathname)
  return (
    <>
      <nav className="hstepper" aria-label="New customer flow">
        {STEPS.map((s) => {
          const isActive = s.num === activeStep
          const isDone = s.num < activeStep
          const cls = ['hstep',
            isActive && 'is-active',
            isDone && 'is-done',
          ].filter(Boolean).join(' ')
          return (
            <Link key={s.num} className={cls} to={s.path}>
              <span className="hstep__circle">{isDone ? <Check /> : s.num}</span>
              <span>{s.label}</span>
            </Link>
          )
        })}
      </nav>
      <Outlet />
    </>
  )
}
