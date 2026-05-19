import { useEffect, useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Loader2, ShieldCheck, Zap } from 'lucide-react'
import { useIssueCard } from './IssueCardContext'
import {
  findBank, findProduct, genIdempotencyKey, genRequestId,
  genCardId, genVaId, maskPan, maskBvn,
} from './data'

export default function Review() {
  const navigate = useNavigate()
  const { state, patch } = useIssueCard()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!state.idempotencyKey || !state.requestId) {
      patch({
        idempotencyKey: state.idempotencyKey ?? genIdempotencyKey(),
        requestId: state.requestId ?? genRequestId(),
      })
    }
  }, [state.idempotencyKey, state.requestId, patch])

  if (!state.customerId || !state.productId || !state.productType || !state.customer) {
    return <Navigate to="/portal/issue-card" replace />
  }

  const bank = findBank(state.bankId)
  const product = findProduct(state.bankId, state.productId)
  if (!bank || !product) return <Navigate to="/portal/issue-card/card" replace />

  const c = state.customer
  const d = state.delivery

  function onSubmit() {
    setSubmitting(true)
    window.setTimeout(() => {
      patch({
        outcome: {
          cardId: genCardId(),
          maskedPan: maskPan(),
          expiryMonth: String(1 + Math.floor(Math.random() * 12)).padStart(2, '0'),
          expiryYear: String(28 + Math.floor(Math.random() * 4)),
          status: state.productType === 'VIRTUAL' ? 'ACTIVE' : 'PERSONALIZING',
          virtualAccount: { virtualAccountId: genVaId(), status: 'ACTIVE' },
          createdAt: new Date().toISOString(),
        },
      })
      navigate('/portal/issue-card/result')
    }, 1400)
  }

  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Review & confirm</h1>
            <p className="page-sub">
              Check the customer payload and card selection. On <strong>Issue card</strong> we
              post a single request to persist customer + card and provision the virtual account.
            </p>
          </div>
        </header>

        <div className="idempotency-strip">
          <ShieldCheck />
          <div>
            Request <span className="key">{state.requestId}</span> · Idempotency key{' '}
            <span className="key">{state.idempotencyKey}</span> — same key replayed returns the
            same outcome.
          </div>
        </div>

        <div className="review-grid">
          <div className="review-panel">
            <div className="review-head">
              <span className="review-title">Customer</span>
              <Link to="/portal/issue-card/customer" className="review-edit">
                <Edit2 /> Edit
              </Link>
            </div>
            <div className="review-body">
              <dl className="profile-specs">
                <div><dt>Full name</dt><dd>{c.fullName}</dd></div>
                <div><dt>Customer ID</dt><dd className="mono">{state.customerId}</dd></div>
                <div><dt>Mobile</dt><dd className="mono">{c.phone}</dd></div>
                <div><dt>Email</dt><dd>{c.email || <span className="muted">not provided</span>}</dd></div>
                <div><dt>BVN</dt><dd className="mono">{maskBvn(c.bvn)}</dd></div>
                <div><dt>State</dt><dd>{c.state}</dd></div>
              </dl>
            </div>
          </div>

          <div className="review-panel">
            <div className="review-head">
              <span className="review-title">Card</span>
              <Link to="/portal/issue-card/card" className="review-edit">
                <Edit2 /> Edit
              </Link>
            </div>
            <div className="review-body">
              <dl className="profile-specs">
                <div>
                  <dt>Issuing bank</dt>
                  <dd>{bank.name}<br/><span className="mono" style={{ fontSize: 11, color: 'var(--cs-ink-100)' }}>{bank.id}</span></dd>
                </div>
                <div>
                  <dt>Product</dt>
                  <dd>{product.name}<br/><span className="mono" style={{ fontSize: 11, color: 'var(--cs-ink-100)' }}>{product.id}</span></dd>
                </div>
                <div>
                  <dt>Card type</dt>
                  <dd>{state.productType.charAt(0) + state.productType.slice(1).toLowerCase()}</dd>
                </div>
                <div><dt>Currency</dt><dd>{product.currency}</dd></div>
                <div><dt>Limits</dt><dd>{product.limits}</dd></div>
                <div><dt>Fees</dt><dd>{product.fee}</dd></div>
              </dl>
            </div>
          </div>

          {state.productType === 'PHYSICAL' && d && (
            <div className="review-panel wide">
              <div className="review-head">
                <span className="review-title">Delivery</span>
                <Link to="/portal/issue-card/delivery" className="review-edit">
                  <Edit2 /> Edit
                </Link>
              </div>
              <div className="review-body">
                <dl className="profile-specs">
                  <div><dt>Method</dt><dd>{d.method}</dd></div>
                  <div>
                    <dt>Address</dt>
                    <dd style={{ textAlign: 'right' }}>
                      {d.useDefault
                        ? `${c.street}, ${c.lga}, ${c.state}`
                        : `${d.altStreet}, ${d.altLga}, ${d.altState}`}
                    </dd>
                  </div>
                  {d.notes && <div><dt>Notes</dt><dd>{d.notes}</dd></div>}
                  <div><dt>Estimated arrival</dt><dd>5–10 business days</dd></div>
                </dl>
              </div>
            </div>
          )}
        </div>

        <div className="notice info" style={{ marginTop: 18 }}>
          <InfoIcon />
          <div>
            <span className="strong">What happens on submit.</span>{' '}
            Platform obtains a CMS token, computes the signature/MAC, calls CMS
            <code> CreateUnitCard</code>, persists the card + customer outcome, then provisions
            a linked virtual account for funding.
          </div>
        </div>

        <div className="form-foot" style={{ marginTop: 24 }}>
          <Link to="/portal/issue-card/card" className="btn btn-ghost btn-sm">
            <ArrowLeft /> Back
          </Link>
          <button onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-lg">
            {submitting ? (<><Loader2 className="spin" /> Issuing card…</>) : (<><Zap /> Issue card</>)}
          </button>
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
