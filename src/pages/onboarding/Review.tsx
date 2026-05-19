import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, Pencil } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

export default function Review() {
  const { state, setConfirmed } = useOnboarding()
  const navigate = useNavigate()
  const { formData: f, docs, banks, confirmed } = state
  const docsCount = Object.values(docs).filter(Boolean).length

  function submit() {
    // Validate: any missing docs or zero banks → errors page
    if (docsCount < 5 || banks.length === 0) {
      navigate('/onboarding/errors')
      return
    }
    navigate('/onboarding/submitted')
  }

  return (
    <>
      <div className="onb-eyebrow">Step 4 of 4</div>
      <h2 className="onb-title">Review your application</h2>
      <p className="onb-sub">Take a moment to confirm everything is right. Once submitted, our team will review within 2 working days.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Section title="Organization & contact" onEdit={() => navigate('/onboarding/org')}>
          <Row k="Legal name" v={f.legalName || '—'} />
          <Row k="RC number" v={f.regNo || '—'} />
          <Row k="TIN" v={f.tin || '—'} />
          <Row k="Address" v={f.address || '—'} />
          <Row k="Industry" v={f.industry} />
          <Row k="Contact" v={`${f.contactName} · ${f.contactRole}`} />
          <Row k="Email" v={f.email} />
          <Row k="Phone" v={f.phone} />
        </Section>

        <Section title={`Documents (${docsCount}/5)`} onEdit={() => navigate('/onboarding/docs')}>
          {Object.entries(docs).map(([k, v]) => (
            <Row
              key={k}
              k={k.toUpperCase()}
              v={v ? (
                <><Check size={13} color="var(--cs-green-700)" /> {v.name}</>
              ) : (
                <span style={{ color: 'var(--cs-red-700)' }}>Missing</span>
              )}
            />
          ))}
        </Section>

        <Section title={`Issuing banks (${banks.length})`} onEdit={() => navigate('/onboarding/banks')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {banks.length ? (
              banks.map((b) => (
                <span key={b} className="onb-tag ok" style={{ textTransform: 'uppercase' }}>{b}</span>
              ))
            ) : (
              <span style={{ color: 'var(--cs-red-700)', fontSize: 13 }}>No banks selected</span>
            )}
          </div>
        </Section>
      </div>

      <div className="onb-card pad" style={{ marginTop: 18 }}>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={confirmed.terms}
            onChange={(e) => setConfirmed({ ...confirmed, terms: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--cs-green-700)' }}
          />
          <span style={{ fontSize: 14, color: 'var(--cs-ink-400)', lineHeight: 1.55 }}>
            I confirm that all information provided is accurate, and I have authority to submit
            this application on behalf of my organization. I accept the{' '}
            <a href="#terms" style={{ color: 'var(--cs-green-700)', fontWeight: 600 }}>Kardit Affiliate Terms</a>{' '}
            and{' '}
            <a href="#privacy" style={{ color: 'var(--cs-green-700)', fontWeight: 600 }}>Privacy Policy</a>.
          </span>
        </label>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginTop: 12 }}>
          <input
            type="checkbox"
            checked={confirmed.contact}
            onChange={(e) => setConfirmed({ ...confirmed, contact: e.target.checked })}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: 'var(--cs-green-700)' }}
          />
          <span style={{ fontSize: 14, color: 'var(--cs-ink-400)', lineHeight: 1.55 }}>
            Kardit may contact me about my application via email or phone.
          </span>
        </label>
      </div>

      <div className="onb-step-actions">
        <Link to="/onboarding/banks" className="onb-btn onb-btn-ghost">← Back</Link>
        <button
          type="button"
          className="onb-btn onb-btn-accent"
          disabled={!confirmed.terms}
          onClick={submit}
        >
          Submit application <ArrowRight size={16} />
        </button>
      </div>
    </>
  )
}

function Section({
  title, onEdit, children,
}: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="onb-card">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 22px', borderBottom: '1px solid var(--cs-line)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--cs-ink-700)' }}>
          {title}
        </div>
        <button
          type="button"
          className="onb-btn onb-btn-ghost"
          style={{ padding: '6px 10px', fontSize: 13, color: 'var(--cs-green-700)' }}
          onClick={onEdit}
        >
          <Pencil size={14} /> Edit
        </button>
      </div>
      <div style={{ padding: '8px 22px 16px' }}>{children}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14,
      padding: '8px 0', borderBottom: '1px solid var(--cs-line)',
      fontSize: 14,
    }}>
      <div style={{
        color: 'var(--cs-ink-100)', fontSize: 12,
        textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700,
      }}>
        {k}
      </div>
      <div style={{ color: 'var(--cs-ink-700)', display: 'flex', alignItems: 'center', gap: 6 }}>{v}</div>
    </div>
  )
}
