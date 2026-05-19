import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, Snowflake, X } from 'lucide-react'
import { findCard } from './cardLookup'
import { FREEZE_REASONS, genCmsRef, genIdemKey, genReqId } from './data'
import { setOverride } from './overrideStorage'
import { NotFound } from './NotFound'

export default function FreezeConfirm() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const ids = useMemo(() => ({
    req: genReqId('REQ-FRZ'),
    idem: genIdemKey('frz'),
  }), [])

  if (!cardId) return <NotFound cardId={null} />
  const card = findCard(cardId)
  if (!card) return <NotFound cardId={cardId} />

  if (card.status !== 'ACTIVE') {
    return (
      <main className="scr-main">
        <div className="container container--narrow">
          <div className="confirm-card" style={{ marginTop: 24 }}>
            <div className="confirm-icon freeze"><AlertTriangle /></div>
            <div className="confirm-title">Cannot freeze this card</div>
            <div className="confirm-sub">
              Card status is <strong>{card.status}</strong>. Freeze is only valid from ACTIVE.
              {card.status === 'FROZEN' && (
                <><br />It is already frozen — return to detail to unfreeze.</>
              )}
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
        status: 'FROZEN',
        changedAt: new Date().toISOString(),
        cmsRef: genCmsRef('CMS-SRV'),
        reason,
      })
      navigate(`/portal/card/${encodeURIComponent(card.id)}?just=froze`)
    }, 1100)
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <div className="confirm-card" style={{ marginTop: 24 }}>
          <div className="confirm-icon freeze"><Snowflake /></div>
          <div className="confirm-title">Freeze this card?</div>
          <div className="confirm-sub">
            Freezing prevents authorisations. The card holder cannot transact until you unfreeze
            it. Action is reversible.
          </div>

          <div className="confirm-card-mini">
            <div className={card.type === 'PHYSICAL' ? 'confirm-chip physical' : 'confirm-chip'} />
            <div className="confirm-card-info">
              <div className="confirm-card-pan">{card.maskedPan.replace(/\*/g, '•')}</div>
              <div className="confirm-card-meta">
                {card.product} · {card.bank} · {card.owner.fullName}
              </div>
            </div>
          </div>

          <div className="transition-arrow">
            <span className="transition-status active">ACTIVE</span>
            <span className="arr"><ArrowRight /></span>
            <span className="transition-status frozen">FROZEN</span>
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
                {FREEZE_REASONS.map((r) => (
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
              <button type="submit" disabled={submitting} className="btn btn-primary"
                      style={{ background: '#1B547F' }}>
                {submitting
                  ? (<><Loader2 className="spin" /> Calling CMS…</>)
                  : (<><Snowflake /> Freeze card</>)}
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
