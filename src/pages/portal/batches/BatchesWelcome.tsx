import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { STEPS, CURRENT_BATCH_ID } from './data'

const RESUME_STEP = 3

export default function BatchesWelcome() {
  return (
    <main className="scr-main scr-main--welcome">
      <div className="container">
        <header className="welcome-head">
          <div className="welcome-text">
            <div className="welcome-eyebrow">THE BATCH ISSUANCE JOURNEY</div>
            <h1 className="welcome-title">Seven steps. One at a time.</h1>
            <p className="welcome-sub">
              Each screen is a real moment in the batch onboarding flow — the same one your team
              uses to upload customer files, validate them, route through maker–checker approval,
              and process bulk customer + card issuance into the CMS.
            </p>
          </div>

          <div className="currently-pill" aria-label="Current step">
            <div className="currently-pill__num">
              <span className="currently-pill__num-big">{RESUME_STEP}</span>
              <span className="currently-pill__num-total">/ 7</span>
            </div>
            <div className="currently-pill__meta">
              <div className="currently-pill__label">CURRENTLY</div>
              <div className="currently-pill__value">{STEPS[RESUME_STEP - 1].label}</div>
            </div>
          </div>
        </header>

        <section className="resume-banner" aria-label="Resume status">
          <div className="resume-banner__icon"><Clock /></div>
          <div className="resume-banner__body">
            <div className="resume-banner__title">Welcome back — your batch is saved.</div>
            <div className="resume-banner__meta">
              <span className="mono">{CURRENT_BATCH_ID}</span> · Step {RESUME_STEP} of 7 · Last edited 12 min ago
            </div>
          </div>
          <div className="resume-banner__actions">
            <Link className="btn-accent" to="/portal/batches/validation">
              Resume Batch <ArrowRight />
            </Link>
            <Link className="btn-link-green" to="/portal/batches">Start Over</Link>
          </div>
        </section>

        <section aria-label="Journey overview">
          <nav className="big-stepper" aria-label="Batch issuance journey">
            {STEPS.map((s) => {
              const isActive = s.num === RESUME_STEP
              const isDone = s.num < RESUME_STEP
              const cls = ['big-step', isActive && 'is-active', isDone && 'is-done'].filter(Boolean).join(' ')
              return (
                <Link key={s.id} className={cls} to={s.path}>
                  <span className="big-step__circle">{isDone ? <Check /> : s.num}</span>
                  <span className="big-step__label">{s.label}</span>
                </Link>
              )
            })}
          </nav>
        </section>
      </div>
    </main>
  )
}
