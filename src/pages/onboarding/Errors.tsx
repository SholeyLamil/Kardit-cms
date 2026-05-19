import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'

const ISSUES = [
  { section: 'org',   path: '/onboarding/org',   field: 'TIN Number',       msg: 'TIN appears invalid — must be 10 digits.' },
  { section: 'docs',  path: '/onboarding/docs',  field: 'Proof of Address', msg: 'No file uploaded. Required for KYB.' },
  { section: 'banks', path: '/onboarding/banks', field: 'Issuing Banks',    msg: 'Select at least one issuing bank.' },
]

export default function Errors() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 600, margin: '32px auto', padding: 32 }}>
      <div style={{
        width: 72, height: 72, borderRadius: 999,
        background: 'var(--cs-red-100)', color: 'var(--cs-red-700)',
        display: 'grid', placeItems: 'center',
        margin: '0 auto 18px',
        border: '3px solid var(--cs-red-300)',
      }}>
        <AlertCircle size={32} />
      </div>
      <h2 className="onb-title" style={{ fontSize: 28, textAlign: 'center' }}>We can't submit yet.</h2>
      <p className="onb-sub" style={{ textAlign: 'center', margin: '8px auto 22px' }}>
        A few items need attention before your application can be sent for review.
      </p>

      <div className="onb-card">
        <div style={{
          padding: '14px 22px', borderBottom: '1px solid var(--cs-line)',
          fontWeight: 700, color: 'var(--cs-ink-700)', fontSize: 14,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{ISSUES.length} issue{ISSUES.length === 1 ? '' : 's'} to fix</span>
          <span className="onb-tag err">Action required</span>
        </div>
        {ISSUES.map((it, i) => (
          <div
            key={it.section}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 22px',
              borderBottom: i < ISSUES.length - 1 ? '1px solid var(--cs-line)' : 'none',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 999,
              background: 'var(--cs-red-100)', color: 'var(--cs-red-700)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <AlertCircle size={14} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, color: 'var(--cs-ink-100)',
                textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
              }}>
                {it.section}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cs-ink-700)', marginTop: 2 }}>{it.field}</div>
              <div style={{ fontSize: 13, color: 'var(--cs-ink-200)', marginTop: 4 }}>{it.msg}</div>
            </div>
            <button
              type="button"
              className="onb-btn onb-btn-secondary"
              style={{ padding: '6px 12px', fontSize: 13 }}
              onClick={() => navigate(it.path)}
            >
              Fix Now →
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
        <Link to="/onboarding/review" className="onb-btn onb-btn-ghost">← Back to review</Link>
        <Link to="/onboarding/org" className="onb-btn onb-btn-primary">
          Fix all issues <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
