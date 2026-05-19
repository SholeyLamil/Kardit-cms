import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, UserPlus } from 'lucide-react'
import { useIssueCard } from './IssueCardContext'
import { KNOWN_CUSTOMERS } from './data'
import type { Customer } from './data'
import { findCustomer, customerFullName } from '../customers/data'
import { readDraft } from '../customers/draftStorage'

export default function Start() {
  const { state, patch } = useIssueCard()
  const [params] = useSearchParams()
  const customerId = params.get('customerId')
  const warm = useMemo<Customer | null>(() => {
    if (!customerId) return null
    if (KNOWN_CUSTOMERS[customerId]) return KNOWN_CUSTOMERS[customerId]
    const c = findCustomer(customerId)
    if (c) {
      return {
        fullName: customerFullName(c),
        phone: c.phone,
        email: c.email ?? undefined,
        state: c.state,
        bvn: c.bvn,
        street: c.street,
        lga: c.lga,
        nin: c.nin ?? undefined,
      }
    }
    const draft = readDraft()
    if (draft && draft.ref === customerId) {
      return {
        fullName: [draft.firstName, draft.middleName, draft.lastName].filter(Boolean).join(' '),
        phone: draft.phone,
        email: draft.email ?? undefined,
        state: draft.state,
        bvn: draft.bvn,
        street: draft.street,
        lga: draft.lga,
        nin: draft.nin ?? undefined,
      }
    }
    return null
  }, [customerId])

  useEffect(() => {
    if (customerId && warm && state.customerId !== customerId) {
      patch({ customerId, customer: warm })
    }
  }, [customerId, warm, state.customerId, patch])

  return (
    <main className="scr-main">
      <div className="container">
        <section className="iss-hero">
          <div className="iss-hero-body">
            <div className="iss-hero-eyebrow">Unified issuance</div>
            <h1 className="iss-hero-title">Issue a card</h1>
            <p className="iss-hero-sub">
              Capture customer details and issue their first card in one continuous flow.
              Customer record and card are persisted as one issuance outcome, and a virtual
              account is auto-provisioned for funding.
            </p>

            {warm ? (
              <div className="iss-warm-banner" style={{ display: 'flex' }}>
                <div className="av">{initials(warm.fullName)}</div>
                <div className="body">
                  <div className="ttl">Issuing card for <span>{warm.fullName}</span></div>
                  <div className="mta">
                    Customer reference <span>{customerId}</span> · skipping capture
                  </div>
                </div>
                <Link to="/portal/issue-card/card" className="btn btn-primary">
                  Continue to card selection <ArrowRight />
                </Link>
              </div>
            ) : (
              <div className="iss-hero-cta">
                <Link to="/portal/issue-card/customer" className="btn btn-primary btn-lg">
                  <UserPlus /> Create Customer & Issue Card
                </Link>
                <Link to="/portal/customers" className="btn btn-ghost">
                  Existing customer
                </Link>
              </div>
            )}
          </div>
          <div className="iss-hero-art">VERVE · KARDIT</div>
        </section>

        <div className="notice info" style={{ marginTop: 24 }}>
          <InfoIcon />
          <div>
            <span className="strong">How it works.</span>{' '}
            Six screens: capture customer, pick bank & product, choose virtual or physical,
            confirm delivery (physical only), review, and issue. An idempotency key prevents
            duplicate issuance on retry.
          </div>
        </div>

        {state.customerId && !warm && (
          <div className="notice info" style={{ marginTop: 12 }}>
            <InfoIcon />
            <div>
              Resuming session for <strong>{state.customer?.fullName}</strong> ({state.customerId}).{' '}
              <Link to="/portal/issue-card/card">Continue →</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
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
