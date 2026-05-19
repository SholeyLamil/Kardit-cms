import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

export default function Submitted() {
  const { state } = useOnboarding()
  const today = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ maxWidth: 560, margin: '32px auto', padding: 32, textAlign: 'center' }}>
      <div style={{
        width: 88, height: 88, borderRadius: 999,
        background: 'var(--cs-green-100)', color: 'var(--cs-green-700)',
        display: 'grid', placeItems: 'center',
        margin: '0 auto 22px',
        border: '4px solid var(--cs-green-300)',
      }}>
        <Check size={42} />
      </div>
      <div className="onb-eyebrow">Application submitted</div>
      <h1 className="onb-title" style={{ fontSize: 36 }}>You're all set, Adaeze.</h1>
      <p className="onb-sub" style={{ fontSize: 16, margin: '12px auto 28px' }}>
        We've received your application. Our compliance team reviews most submissions within
        2 working days, and we'll email you the moment there's news.
      </p>

      <div className="onb-card pad" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{
              fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: 'var(--cs-ink-100)', fontWeight: 700,
            }}>
              Case ID
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 700,
              fontSize: 22, color: 'var(--cs-ink-900)', marginTop: 4,
            }}>
              {state.caseId}
            </div>
          </div>
          <span className="onb-tag ok" style={{ padding: '6px 14px', fontSize: 13 }}>● Submitted</span>
        </div>
        <div style={{
          borderTop: '1px solid var(--cs-line)', marginTop: 16, paddingTop: 16,
          fontSize: 13, color: 'var(--cs-ink-200)',
        }}>
          Submitted on {today} · Expected response by 2 working days.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
        <Link to="/onboarding" className="onb-btn onb-btn-secondary">Back to dashboard</Link>
        <Link to="/onboarding/status" className="onb-btn onb-btn-primary">
          View Status <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
