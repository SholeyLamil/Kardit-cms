import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

type Errors = Partial<Record<'legalName' | 'regNo' | 'contactName' | 'email', string>>

export default function Org() {
  const { state, setFormData } = useOnboarding()
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Errors>({})
  const f = state.formData
  const set = (k: keyof typeof f, v: string) => setFormData({ ...f, [k]: v })

  function next() {
    const e: Errors = {}
    if (!f.legalName.trim()) e.legalName = 'Legal name is required'
    if (!f.regNo.trim()) e.regNo = 'RC / registration number is required'
    if (!f.contactName.trim()) e.contactName = 'Primary contact name is required'
    if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'A valid work email is required'
    setErrors(e)
    if (Object.keys(e).length === 0) navigate('/onboarding/docs')
  }

  return (
    <>
      <div className="onb-eyebrow">Step 1 of 4</div>
      <h2 className="onb-title">Tell us about your organization</h2>
      <p className="onb-sub">All fields are required unless marked optional. Use your registered business name and address as on file with CAC.</p>

      <div className="onb-card pad">
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cs-ink-700)', margin: '0 0 18px' }}>
          Organization details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Legal business name" error={errors.legalName}>
            <input value={f.legalName} onChange={(e) => set('legalName', e.target.value)} placeholder="e.g. Acme Microfinance Bank Ltd" />
          </Field>
          <div className="onb-grid-2">
            <Field label="RC / Registration number" error={errors.regNo}>
              <input value={f.regNo} onChange={(e) => set('regNo', e.target.value)} placeholder="RC 1234567" />
            </Field>
            <Field label={<>Tax ID (TIN) <span style={{ color: 'var(--cs-ink-100)', fontWeight: 400 }}>· optional</span></>}>
              <input value={f.tin} onChange={(e) => set('tin', e.target.value)} placeholder="0000000-0001" />
            </Field>
          </div>
          <Field label="Registered address">
            <input value={f.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, city, state" />
          </Field>
          <div className="onb-grid-2">
            <Field label="Country">
              <select value={f.country} onChange={(e) => set('country', e.target.value)}>
                <option>Nigeria</option>
                <option>Ghana</option>
                <option>Kenya</option>
              </select>
            </Field>
            <Field label="Industry">
              <select value={f.industry} onChange={(e) => set('industry', e.target.value)}>
                <option>Microfinance</option>
                <option>Fintech</option>
                <option>Retail</option>
                <option>Government</option>
                <option>Healthcare</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div className="onb-card pad" style={{ marginTop: 18 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--cs-ink-700)', margin: '0 0 18px' }}>
          Primary contact
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="onb-grid-2">
            <Field label="Full name" error={errors.contactName}>
              <input value={f.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Adaeze Okafor" />
            </Field>
            <Field label="Role">
              <input value={f.contactRole} onChange={(e) => set('contactRole', e.target.value)} placeholder="Head of Operations" />
            </Field>
          </div>
          <div className="onb-grid-2">
            <Field label="Work email" error={errors.email}>
              <input type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="adaeze@acme.ng" />
            </Field>
            <Field label="Phone">
              <input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+234 803 000 0000" />
            </Field>
          </div>
        </div>
      </div>

      <div className="onb-step-actions">
        <Link to="/onboarding" className="onb-btn onb-btn-ghost">← Cancel</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/onboarding" className="onb-btn onb-btn-secondary">Save Draft</Link>
          <button type="button" className="onb-btn onb-btn-primary" onClick={next}>
            Next: Documents <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  )
}

function Field({
  label, error, children,
}: { label: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className={error ? 'onb-field has-error' : 'onb-field'}>
      <label>{label}</label>
      {children}
      {error && (
        <span className="err">
          <AlertCircle size={13} /> {error}
        </span>
      )}
    </div>
  )
}
