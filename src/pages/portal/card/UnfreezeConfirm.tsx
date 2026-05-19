import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, PlayCircle, X } from 'lucide-react'
import { findCard } from './cardLookup'
import { UNFREEZE_REASONS, genCmsRef, genIdemKey, genReqId } from './data'
import { setOverride } from './overrideStorage'
import { NotFound } from './NotFound'

export default function UnfreezeConfirm() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const ids = useMemo(() => ({
    req: genReqId('REQ-UNF'),
    idem: genIdemKey('unf'),
  }), [])

  if (!cardId) return <NotFound cardId={null} />
  const card = findCard(cardId)
  if (!card) return <NotFound cardId={cardId} />

  if (card.status !== 'FROZEN') {
    return (
      <main className="scr-main">
        <div className="container container--narrow">
          <div className="confirm-card" style={{ marginTop: 24 }}>
            <div className="confirm-icon unfreeze"><AlertTriangle /></div>
            <div className="confirm-title">Cannot unfreeze this card</div>
            <div className="confirm-sub">
              Card status is <strong>{card.status}</strong>. Unfreeze is only valid from FROZEN.
            </div>
            <div className="confirm-actions">
              <Link to={`/portal/card/${encodeURIComponent(card.id)}`} className="btn btn-primary">
                <ArrowLeft /> Back to card
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason || !card) return
    setSubmitting(true)
    window.setTimeout(() => {
      setOverride(card.id, {
        status: 'ACTIVE',
        changedAt: new Date().toISOString(),
        cmsRef: genCmsRef('CMS-SRV'),
        reason,
      })
      navigate(`/portal/card/${encodeURIComponent(card.id)}?just=unfroze`)
    }, 1100)
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <div className="confirm-card" style={{ marginTop: 24 }}>
          <div className="confirm-icon unfreeze"><PlayCircle /></div>
          <div className="confirm-title">Unfreeze this card?</div>
          <div className="confirm-sub">
            Unfreezing returns the card to ACTIVE. Authorisations resume immediately.
          </div>

          <div className="confirm-card-mini">
            <div className={card.type === 'PHYSICAL' ? 'confirm-chip frozen physical' : 'confirm-chip frozen'} />
            <div className="confirm-card-info">
              <div className="confirm-card-pan">{card.maskedPan.replace(/\*/g, '•')}</div>
              <div className="confirm-card-meta">
                {card.product} · {card.bank} · {card.owner.fullName}
              </div>
            </div>
          </div>

          <div className="transition-arrow">
            <span className="transition-status frozen">FROZEN</span>
            <span className="arr"><ArrowRight /></span>
            <span className="transition-status active">ACTIVE</span>
          </div>

          <form onSubmit={onSubmit} autoComplete="off">
            <div className="field" style={{ marginBottom: 20 }}>
              <label htmlFor="reason" style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--cs-ink-700)', marginBottom: 8, display: 'block',
              }}>
                Reason<span className="req">*</span>
              </label>
              <select id="reason" required value={reason} onChange={(e) => setReason(e.target.value)}
                      style={{
                        background: 'var(--cs-white)',
                        border: '1px solid var(--cs-line-strong)',
                        borderRadius: 6, padding: '10px 13px',
                        fontSize: 13.5, width: '100%',
                      }}>
                <option value="">Select a reason…</option>
                {UNFREEZE_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <div className="help" style={{
                fontSize: 11.5, color: 'var(--cs-ink-100)', marginTop: 5,
              }}>
                Recorded in the card lifecycle event log and audit trail.
              </div>
            </div>

            <div className="confirm-actions">
              <Link to={`/portal/card/${encodeURIComponent(card.id)}`} className="btn btn-ghost">
                <X /> Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn btn-primary">
                {submitting
                  ? (<><Loader2 className="spin" /> Calling CMS…</>)
                  : (<><PlayCircle /> Unfreeze card</>)}
              </button>
            </div>
          </form>

          <div className="idem-key-strip">
            <strong>Request</strong> {ids.req} · <strong>Idempotency</strong> {ids.idem}
          </div>
        </div>
      </div>
    </main>
  )
}
