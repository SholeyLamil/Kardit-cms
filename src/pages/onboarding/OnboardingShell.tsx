import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, HelpCircle, Info } from 'lucide-react'
import { KarditWordmark } from '../../components/Logo'
import { STEPS, type StepId } from './OnboardingContext'

const STEP_TITLE: Record<string, string> = {
  '/onboarding/org': 'Organization & Contact',
  '/onboarding/docs': 'KYB / KYC Documents',
  '/onboarding/banks': 'Issuing Banks',
  '/onboarding/review': 'Review & Submit',
  '/onboarding/submitted': 'Submitted',
  '/onboarding/errors': 'Errors',
  '/onboarding/status': 'Application Status',
  '/onboarding/respond': 'Respond to Clarification',
}

function activeStepFor(pathname: string): StepId | null {
  if (pathname.startsWith('/onboarding/org')) return 'org'
  if (pathname.startsWith('/onboarding/docs')) return 'docs'
  if (pathname.startsWith('/onboarding/banks')) return 'banks'
  if (pathname.startsWith('/onboarding/review')) return 'review'
  if (pathname.startsWith('/onboarding/status') || pathname.startsWith('/onboarding/respond')) return 'status'
  return null
}

function doneStepsFor(active: StepId | null): StepId[] {
  if (!active) return []
  const order: StepId[] = ['org', 'docs', 'banks', 'review', 'status']
  const idx = order.indexOf(active)
  return order.slice(0, idx)
}

const HIDE_RAIL_PATHS = ['/onboarding', '/onboarding/submitted', '/onboarding/errors', '/onboarding/status', '/onboarding/respond']

export default function OnboardingShell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = activeStepFor(pathname)
  const done = doneStepsFor(active)
  const hideRail = HIDE_RAIL_PATHS.includes(pathname)
  const stepTitle = STEP_TITLE[pathname]

  return (
    <div className="onb-scr">
      <header className="onb-app-bar">
        <Link to="/" aria-label="Kardit home" style={{ display: 'inline-block' }}>
          <KarditWordmark />
        </Link>
        <div style={{ width: 1, height: 28, background: 'var(--cs-line)' }} />
        <div className="crumbs">
          <span>Affiliate Portal</span>
          {stepTitle && (
            <>
              <ChevronRight size={14} color="var(--cs-ink-100)" />
              <strong>{stepTitle}</strong>
            </>
          )}
        </div>
        <div className="spacer" />
        <a href="#help" style={{ fontSize: 13, color: 'var(--cs-ink-200)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <HelpCircle size={16} /> Help
        </a>
        <div className="user">
          <div className="avatar">AO</div>
          <div>
            <div style={{ color: 'var(--cs-ink-700)', fontWeight: 600 }}>Adaeze O.</div>
            <div style={{ fontSize: 11, color: 'var(--cs-ink-100)' }}>Acme Microfinance</div>
          </div>
        </div>
      </header>

      <div className={hideRail ? 'onb-body no-rail' : 'onb-body'}>
        {!hideRail && (
          <aside className="onb-rail">
            <h6>Onboarding Progress</h6>
            <ol>
              {STEPS.map((s) => {
                const isActive = s.id === active
                const isDone = done.includes(s.id)
                const cls = [isActive && 'is-active', isDone && 'is-done'].filter(Boolean).join(' ')
                return (
                  <li
                    key={s.id}
                    className={cls}
                    onClick={() => navigate(s.path)}
                  >
                    <div className="step-dot">{isDone ? '✓' : s.n}</div>
                    <div style={{ flex: 1 }}>
                      <div>{s.label}</div>
                      <div className="step-meta">{s.meta}</div>
                    </div>
                  </li>
                )
              })}
            </ol>
            <div style={{
              marginTop: 32, padding: 14,
              background: 'var(--cs-green-100)',
              border: '1px solid var(--cs-green-300)',
              borderRadius: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--cs-green-900)' }}>
                <Info size={14} /> Need help?
              </div>
              <div style={{ fontSize: 12, color: 'var(--cs-ink-200)', marginTop: 6, lineHeight: 1.5 }}>
                Save your progress at any time. Our team is available 9am–6pm WAT to walk you through the process.
              </div>
              <Link to="/contact" style={{ fontSize: 12, fontWeight: 700, color: 'var(--cs-green-700)', textDecoration: 'none', marginTop: 10, display: 'inline-block' }}>
                Talk to a Consultant →
              </Link>
            </div>
          </aside>
        )}
        <main className="onb-main">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
