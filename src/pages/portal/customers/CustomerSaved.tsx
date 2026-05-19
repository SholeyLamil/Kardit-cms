import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Check, Copy, CreditCard, Eye, UserPlus } from 'lucide-react'
import { readDraft } from './draftStorage'
import { maskBvn } from './data'

const NATIONALITY: Record<string, string> = {
  NG: 'Nigerian', GH: 'Ghanaian', KE: 'Kenyan', ZA: 'South African',
}

const STATE_NAMES: Record<string, string> = {
  LA: 'Lagos', AB: 'Abia', AD: 'Adamawa', AK: 'Akwa Ibom', AN: 'Anambra',
  BA: 'Bauchi', BY: 'Bayelsa', BE: 'Benue', BO: 'Borno', CR: 'Cross River',
  DE: 'Delta', EB: 'Ebonyi', ED: 'Edo', EK: 'Ekiti', EN: 'Enugu', FC: 'FCT — Abuja',
  GO: 'Gombe', IM: 'Imo', JI: 'Jigawa', KD: 'Kaduna', KN: 'Kano', KT: 'Katsina',
  KE: 'Kebbi', KO: 'Kogi', KW: 'Kwara', NA: 'Nasarawa', NI: 'Niger', OG: 'Ogun',
  ON: 'Ondo', OS: 'Osun', OY: 'Oyo', PL: 'Plateau', RI: 'Rivers', SO: 'Sokoto',
  TA: 'Taraba', YO: 'Yobe', ZA: 'Zamfara',
}

export default function CustomerSaved() {
  const draft = readDraft()
  const [copied, setCopied] = useState(false)

  if (!draft) return <Navigate to="/portal/customers/new" replace />

  const fullName = [draft.firstName, draft.middleName, draft.lastName].filter(Boolean).join(' ')

  function copyId() {
    navigator.clipboard?.writeText(draft!.ref)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header className="page-head">
          <div>
            <h1 className="page-title">Customer saved</h1>
            <p className="page-sub">
              Captured as a draft record. You can issue a card immediately or continue working on
              other customers and come back later.
            </p>
          </div>
        </header>

        <section className="saved-card">
          <div className="saved-icon"><Check /></div>

          <div className="saved-title">{fullName}</div>
          <div className="saved-sub">Customer profile created and queued for card issuance.</div>

          <div className="saved-id">
            <span>{draft.ref}</span>
            <button onClick={copyId} className="copy-btn"
                    type="button" aria-label="Copy customer ID">
              {copied ? <Check /> : <Copy />}
            </button>
          </div>

          <dl className="specs saved-details">
            <div><dt>Status</dt><dd><span className="badge pending">DRAFT</span></dd></div>
            <div><dt>Customer type</dt>
              <dd>{draft.customerType === 'corporate' ? 'Corporate' : 'Individual'}</dd>
            </div>
            <div><dt>Mobile number</dt><dd className="mono">{draft.phone}</dd></div>
            <div><dt>Nationality</dt><dd>{NATIONALITY[draft.nationality] ?? draft.nationality}</dd></div>
            <div><dt>State</dt><dd>{STATE_NAMES[draft.state] ?? draft.state}</dd></div>
            <div><dt>BVN</dt><dd className="mono">{maskBvn(draft.bvn)}</dd></div>
            <div><dt>Captured by</dt><dd>{draft.capturedBy}</dd></div>
          </dl>

          <div className="saved-actions">
            <Link to={`/portal/issue-card?customerId=${encodeURIComponent(draft.ref)}`} className="btn btn-primary">
              <CreditCard /> Issue a card now
            </Link>
            <Link to={`/portal/customers/${encodeURIComponent(draft.ref)}`} className="btn btn-secondary">
              <Eye /> View profile
            </Link>
            <Link to="/portal/customers/new" className="btn btn-ghost">
              <UserPlus /> Add another
            </Link>
            <Link to="/portal" className="btn btn-ghost">Back to home</Link>
          </div>
        </section>

        <div className="notice info" style={{ marginTop: 24 }}>
          <InfoIcon />
          <div>
            <span className="strong">What happens next.</span>{' '}
            Draft customers live in the Customers microservice until completed by card issuance
            or expired per tenant retention rules. They are visible in the customer list at{' '}
            <Link to="/portal/customers" style={{ color: 'var(--cs-green-700)', fontWeight: 700, textDecoration: 'underline' }}>
              Customers
            </Link>.
          </div>
        </div>
      </div>
    </main>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
