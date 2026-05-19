import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Loader2, Send, ShieldCheck, Users } from 'lucide-react'
import { useLoadFunds } from './LoadFundsContext'
import {
  fmtNaira, genCmsRef, genIdem, genReqId, genTxnId, proofTypeLabel,
} from './data'

export default function LoadReview() {
  const navigate = useNavigate()
  const { state, patch } = useLoadFunds()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!state.reqId || !state.idem) {
      patch({ reqId: state.reqId ?? genReqId(), idem: state.idem ?? genIdem() })
    }
  }, [state.reqId, state.idem, patch])

  if (!state.card || state.amount == null || !state.fundingReference) {
    return <Navigate to="/portal/funds" replace />
  }

  const { card, amount, fundingReference: fr, reqId, idem } = state

  function onSubmit() {
    setSubmitting(true)
    window.setTimeout(() => {
      patch({
        outcome: {
          txnId: genTxnId(),
          approvedBy: 'Folake A.',
          approvedAt: new Date().toISOString(),
          cmsRef: genCmsRef(),
          balance: 50_000 + (amount ?? 0),
        },
      })
      navigate('/portal/funds/result')
    }, 1400)
  }

  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Review & submit</h1>
            <p className="page-sub">
              Maker submits — a different user (checker) approves. Idempotency key prevents
              duplicate credit.
            </p>
          </div>
        </header>

        <div className="maker-checker-banner">
          <div className="icn"><Users /></div>
          <div>
            <div className="title">Approval required from a checker</div>
            <div className="body">
              On submit, this load enters the pending approval queue. The CMS load only fires
              after the checker approves AND the VA funding is validated against the
              bank-transfer reference.
            </div>
          </div>
        </div>

        <div className="review-grid">
          <div className="review-panel">
            <div className="review-head">
              <span className="review-title">Card</span>
              <Link to="/portal/funds" className="review-edit"><Edit2 /> Edit</Link>
            </div>
            <div className="review-body">
              <dl className="profile-specs">
                <div><dt>Card ID</dt><dd className="mono">{card.id}</dd></div>
                <div><dt>Masked PAN</dt><dd className="mono">{card.maskedPan.replace(/\*/g, '•')}</dd></div>
                <div><dt>Cardholder</dt><dd>{card.customer}</dd></div>
                <div><dt>Bank · Product</dt><dd>{card.bank} · {card.product}</dd></div>
              </dl>
            </div>
          </div>

          <div className="review-panel">
            <div className="review-head">
              <span className="review-title">Load</span>
              <Link to="/portal/funds" className="review-edit"><Edit2 /> Edit</Link>
            </div>
            <div className="review-body">
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
                color: 'var(--cs-ink-900)', marginBottom: 14, letterSpacing: '-0.02em',
              }}>
                {fmtNaira(amount)}
                <span style={{
                  fontSize: 14, color: 'var(--cs-ink-100)', fontWeight: 600, marginLeft: 6,
                }}>NGN</span>
              </div>
              <dl className="profile-specs">
                <div><dt>Reference</dt>
                  <dd>{state.reference || <span className="muted">none</span>}</dd>
                </div>
                <div><dt>Settlement</dt><dd>Immediate on approval + VA validation</dd></div>
              </dl>
            </div>
          </div>

          <div className="review-panel wide">
            <div className="review-head">
              <span className="review-title">Funding reference</span>
              <Link to="/portal/funds" className="review-edit"><Edit2 /> Edit</Link>
            </div>
            <div className="review-body">
              <dl className="profile-specs">
                <div><dt>Proof type</dt><dd>{proofTypeLabel(fr.proofType)}</dd></div>
                <div><dt>Virtual account number</dt><dd className="mono">{fr.virtualAccountNumber}</dd></div>
                <div><dt>Issuing bank</dt><dd className="mono">{fr.bankId}</dd></div>
                <div><dt>Bank transfer reference</dt><dd className="mono">{fr.bankTransferReference}</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <div className="idempotency-strip" style={{ marginTop: 18 }}>
          <ShieldCheck />
          <div>
            Request <span className="key">{reqId}</span> · Idempotency{' '}
            <span className="key">{idem}</span> — same key replayed returns the same outcome.
          </div>
        </div>

        <div className="form-foot" style={{ marginTop: 24 }}>
          <Link to="/portal/funds" className="btn btn-ghost btn-sm">
            <ArrowLeft /> Back
          </Link>
          <button onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-lg">
            {submitting
              ? (<><Loader2 className="spin" /> Submitting…</>)
              : (<><Send /> Submit for approval</>)}
          </button>
        </div>
      </div>
    </main>
  )
}
