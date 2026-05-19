import { Link, Navigate } from 'react-router-dom'
import { Check, CreditCard, Plus } from 'lucide-react'
import { useLoadFunds } from './LoadFundsContext'
import { fmtNaira, fmtTime, proofTypeLabel } from './data'

export default function LoadResult() {
  const { state, reset } = useLoadFunds()

  if (!state.outcome || !state.card || state.amount == null) {
    return <Navigate to="/portal/funds" replace />
  }

  const c = state.card
  const o = state.outcome
  const fr = state.fundingReference

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <div className="result-card" style={{ textAlign: 'left', padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--cs-green-100)', border: '1.5px solid var(--cs-green-300)',
              color: 'var(--cs-green-700)', display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Check style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
                color: 'var(--cs-ink-900)', letterSpacing: '-0.02em',
              }}>
                Funds loaded
              </div>
              <div style={{ fontSize: 13, color: 'var(--cs-ink-200)', marginTop: 3 }}>
                Approved by {o.approvedBy} · CMS confirmed · linked VA credited
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--cs-paper)', border: '1px solid var(--cs-line)',
            borderRadius: 'var(--cs-radius-md)', padding: 24, marginBottom: 18,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--cs-ink-100)', fontWeight: 700, marginBottom: 8,
            }}>
              Amount loaded
            </div>
            <div className="funded-amount">
              {fmtNaira(state.amount).replace('₦', '')}
              <span className="cur">NGN</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--cs-ink-200)', marginTop: 10 }}>
              Posted to {c.maskedPan.replace(/\*/g, '•')} · {c.customer}
            </div>
            <div style={{ fontSize: 12, color: 'var(--cs-ink-200)', marginTop: 4 }}>
              New ledger balance:{' '}
              <strong style={{ color: 'var(--cs-ink-700)', fontFamily: 'var(--font-mono)' }}>
                {fmtNaira(o.balance)}
              </strong>
            </div>
          </div>

          <dl className="profile-specs">
            <div><dt>Funding transaction ID</dt><dd className="mono">{o.txnId}</dd></div>
            <div><dt>CMS reference</dt><dd className="mono">{o.cmsRef}</dd></div>
            <div><dt>Virtual account</dt><dd className="mono">{fr?.virtualAccountNumber ?? '—'}</dd></div>
            <div><dt>Bank transfer ref</dt><dd className="mono">{fr?.bankTransferReference ?? '—'}</dd></div>
            <div><dt>Proof type</dt><dd>{proofTypeLabel(fr?.proofType)}</dd></div>
            <div><dt>Internal reference</dt>
              <dd>{state.reference || <span className="muted">—</span>}</dd>
            </div>
            <div><dt>Approved at</dt><dd>{fmtTime(o.approvedAt)}</dd></div>
          </dl>

          <div className="audit-trail">
            <div style={{
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--cs-ink-100)', fontWeight: 700, marginBottom: 10,
            }}>
              Maker-checker audit trail
            </div>
            <div className="audit-step">
              <div className="av maker">AO</div>
              <div className="info">
                <div className="who">
                  Adaeze O.{' '}
                  <span style={{ color: 'var(--cs-ink-100)', fontWeight: 400 }}>
                    submitted load request
                  </span>
                </div>
                <div className="what">
                  As maker · request {state.reqId} · idempotency {state.idem?.slice(0, 20)}…
                </div>
              </div>
            </div>
            <div className="audit-step">
              <div className="av">FA</div>
              <div className="info">
                <div className="who">
                  Folake A.{' '}
                  <span style={{ color: 'var(--cs-ink-100)', fontWeight: 400 }}>
                    approved as checker
                  </span>
                </div>
                <div className="what">
                  CMS load fired · VA credited · card balance snapshot updated
                </div>
              </div>
            </div>
          </div>

          <div className="result-actions" style={{
            marginTop: 28, display: 'flex', gap: 12,
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            <Link to={`/portal/funds?cardId=${encodeURIComponent(c.id)}`}
                  className="btn btn-secondary" onClick={reset}>
              <Plus /> Load another
            </Link>
            <Link to={`/portal/card/${encodeURIComponent(c.id)}`} className="btn btn-primary">
              <CreditCard /> View card balance
            </Link>
            <Link to="/portal" className="btn btn-ghost">Back to dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
