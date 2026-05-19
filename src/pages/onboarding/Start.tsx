import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const STEPS_PREVIEW = [
  'Organization & contact details',
  'KYB / KYC documents',
  'Issuing bank selection',
  'Review & submit',
]

export default function Start() {
  return (
    <div className="container container--wide" style={{ padding: '32px 0', maxWidth: 880 }}>
      <div className="onb-eyebrow">Affiliate Onboarding</div>
      <h1 className="onb-title" style={{ fontSize: 44 }}>Welcome to Kardit.</h1>
      <p className="onb-sub" style={{ fontSize: 18 }}>
        Let's get your organization onboarded as a Kardit affiliate. The process takes about 15
        minutes — you can save your progress and come back at any time.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginTop: 32 }}>
        <div className="onb-card pad" style={{ borderTop: '4px solid var(--cs-green-700)' }}>
          <div className="onb-eyebrow" style={{ color: 'var(--cs-green-700)' }}>New application</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--cs-ink-900)', margin: '6px 0 8px' }}>
            Start fresh
          </h3>
          <p style={{ fontSize: 14, color: 'var(--cs-ink-200)', margin: '0 0 18px', lineHeight: 1.6 }}>
            Begin a new onboarding application. We'll guide you through 4 short steps.
          </p>
          <ul style={{ margin: '0 0 22px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STEPS_PREVIEW.map((t, i) => (
              <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--cs-ink-400)' }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999,
                  background: 'var(--cs-green-100)', color: 'var(--cs-green-900)',
                  display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11,
                  border: '1px solid var(--cs-green-300)',
                }}>
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link to="/onboarding/org" className="onb-btn onb-btn-primary">
            Start Onboarding <ArrowRight size={16} />
          </Link>
        </div>

        <div className="onb-card pad">
          <div className="onb-eyebrow" style={{ color: 'var(--cs-ink-100)' }}>Drafts</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cs-ink-700)', margin: '6px 0 14px' }}>
            Continue where you left off
          </h3>
          <div style={{ padding: 14, border: '1px solid var(--cs-line)', borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cs-ink-700)' }}>Acme Microfinance</div>
              <span className="onb-tag warn">Step 2 / 4</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--cs-ink-100)', marginTop: 4 }}>Last edited 2 days ago</div>
            <Link
              to="/onboarding/org"
              className="onb-btn onb-btn-secondary"
              style={{ marginTop: 12, padding: '8px 14px', fontSize: 13 }}
            >
              Continue Draft
            </Link>
          </div>
          <div style={{
            marginTop: 22, padding: '14px 16px',
            background: 'var(--cs-mist)', borderRadius: 10,
            fontSize: 12, color: 'var(--cs-ink-200)', lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--cs-ink-700)' }}>Tip:</strong> Have your CAC certificate,
            TIN and director IDs ready before you start.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 13, color: 'var(--cs-ink-100)' }}>
        Trouble starting?{' '}
        <Link to="/contact" style={{ color: 'var(--cs-green-700)', fontWeight: 600 }}>
          Contact support
        </Link>{' '}
        or call +234-803-394-4566.
      </div>
    </div>
  )
}
