import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Check, Search } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

const ALL_BANKS = [
  { id: 'gtb',       name: 'Guaranty Trust Bank',     code: '058' },
  { id: 'access',    name: 'Access Bank',             code: '044' },
  { id: 'zenith',    name: 'Zenith Bank',             code: '057' },
  { id: 'firstbank', name: 'First Bank of Nigeria',   code: '011' },
  { id: 'uba',       name: 'United Bank for Africa',  code: '033' },
  { id: 'fidelity',  name: 'Fidelity Bank',           code: '070' },
  { id: 'stanbic',   name: 'Stanbic IBTC Bank',       code: '221' },
  { id: 'wema',      name: 'Wema Bank',               code: '035' },
  { id: 'sterling',  name: 'Sterling Bank',           code: '232' },
  { id: 'union',     name: 'Union Bank',              code: '032' },
]

export default function Banks() {
  const { state, setBanks } = useOnboarding()
  const [q, setQ] = useState('')
  const filtered = ALL_BANKS.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()))
  const banks = state.banks

  function toggle(id: string) {
    setBanks(banks.includes(id) ? banks.filter((x) => x !== id) : [...banks, id])
  }

  return (
    <>
      <div className="onb-eyebrow">Step 3 of 4</div>
      <h2 className="onb-title">Select your issuing banks</h2>
      <p className="onb-sub">Choose the banks Kardit will route transactions through on your behalf. You can add more later from your dashboard.</p>

      <div className="onb-card">
        <div style={{
          padding: '14px 22px',
          borderBottom: '1px solid var(--cs-line)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--cs-ink-100)',
            }}>
              <Search size={16} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search banks..."
              style={{
                width: '100%', padding: '10px 12px 10px 38px',
                borderRadius: 8, border: '1px solid var(--cs-line-strong)',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <span className="onb-tag ok">{banks.length} selected</span>
        </div>
        <div style={{ maxHeight: 360, overflow: 'auto' }}>
          {filtered.map((b, i) => {
            const sel = banks.includes(b.id)
            return (
              <label
                key={b.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 22px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--cs-line)' : 'none',
                  cursor: 'pointer',
                  background: sel ? 'var(--cs-green-100)' : '#fff',
                }}
              >
                <input
                  type="checkbox"
                  checked={sel}
                  onChange={() => toggle(b.id)}
                  style={{ width: 18, height: 18, accentColor: 'var(--cs-green-700)' }}
                />
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--cs-mist)', color: 'var(--cs-ink-200)',
                  display: 'grid', placeItems: 'center',
                }}>
                  <Building2 size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cs-ink-700)' }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--cs-ink-100)' }}>CBN code · {b.code}</div>
                </div>
                {sel && <Check size={18} color="var(--cs-green-700)" />}
              </label>
            )
          })}
        </div>
      </div>

      <div className="onb-step-actions">
        <Link to="/onboarding/docs" className="onb-btn onb-btn-ghost">← Back</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/onboarding" className="onb-btn onb-btn-secondary">Save Draft</Link>
          <Link to="/onboarding/review" className="onb-btn onb-btn-primary">
            Review & Submit <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
