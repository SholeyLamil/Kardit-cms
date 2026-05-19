import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ShieldCheck, X } from 'lucide-react'
import { useLoadFunds } from './LoadFundsContext'
import {
  FUND_PROOF_TYPES, LOADABLE_CARDS, QUICK_AMOUNTS, findLoadCard, fmtNaira,
} from './data'
import type { ProofType } from './data'

export default function LoadForm() {
  const navigate = useNavigate()
  const { state, patch } = useLoadFunds()
  const [params] = useSearchParams()
  const urlCardId = params.get('cardId')
  const warmCard = urlCardId ? findLoadCard(urlCardId) : null

  // Sync warm-start cardId from URL into context
  useEffect(() => {
    if (warmCard && state.card?.id !== warmCard.id) {
      patch({ card: warmCard })
    }
  }, [warmCard, state.card?.id, patch])

  const card = warmCard ?? state.card ?? null

  const [amount, setAmount] = useState<string>(
    state.amount != null ? String(state.amount) : '',
  )
  const [proofType, setProofType] = useState<ProofType>(
    state.fundingReference?.proofType ?? 'BANK_TRANSFER_CONFIRMED',
  )
  const [vaNumber, setVaNumber] = useState(state.fundingReference?.virtualAccountNumber ?? '1234567890')
  const [transferRef, setTransferRef] = useState(state.fundingReference?.bankTransferReference ?? '')
  const [reference, setReference] = useState(state.reference ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!card) return
    const amt = parseFloat(amount)
    if (!amt || amt < 100 || !proofType || !vaNumber || !transferRef) return
    patch({
      card,
      amount: amt,
      reference: reference.trim() || null,
      fundingReference: {
        virtualAccountNumber: vaNumber.trim(),
        bankId: card.bankCode,
        bankTransferReference: transferRef.trim(),
        proofType,
      },
    })
    navigate('/portal/funds/review')
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header className="page-head">
          <div>
            <h1 className="page-title">Load funds</h1>
            <p className="page-sub">
              Top up a card's linked virtual account. All loads pass through maker-checker
              before funds are credited.
            </p>
          </div>
        </header>

        {!card ? (
          <CardPicker />
        ) : (
          <>
            <section className="card card-pad-lg"
              style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 60, height: 40, borderRadius: 6, flexShrink: 0,
                background: 'linear-gradient(135deg, #156A38, #0F4F2E)', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 8, left: 7, width: 18, height: 14, borderRadius: 2,
                  background: 'linear-gradient(140deg, #F5DA94, #C09642)',
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 13.5,
                  color: 'var(--cs-ink-700)', fontWeight: 600,
                }}>
                  {card.maskedPan.replace(/\*/g, '•')}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--cs-ink-100)', marginTop: 3 }}>
                  {card.product} · {card.bank} · {card.customer}
                </div>
              </div>
              <Link to="/portal/funds"
                style={{ fontSize: 12, fontWeight: 700, color: 'var(--cs-green-700)', textDecoration: 'none' }}>
                Change card →
              </Link>
            </section>

            <div className="maker-checker-banner">
              <div className="icn"><ShieldCheck /></div>
              <div>
                <div className="title">Maker-checker required</div>
                <div className="body">
                  As a maker, your load request is submitted for checker approval. The funds are
                  not credited until the checker approves. You cannot approve your own request.
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="card card-pad-lg" autoComplete="off">
              <section className="form-section">
                <div className="form-section-head">
                  <h2 className="form-section-title">Amount</h2>
                  <span className="form-section-meta">In NGN</span>
                </div>
                <div className="amount-input-wrap">
                  <span className="currency">₦</span>
                  <input id="amount" name="amount" type="number" inputMode="decimal"
                         step="0.01" min="100" required placeholder="0.00"
                         value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <div className="amount-chips">
                  {QUICK_AMOUNTS.map((a) => (
                    <button key={a} type="button"
                            className={parseFloat(amount) === a ? 'amount-chip active' : 'amount-chip'}
                            onClick={() => setAmount(String(a))}>
                      {fmtNaira(a)}
                    </button>
                  ))}
                </div>
              </section>

              <section className="form-section">
                <div className="form-section-head">
                  <h2 className="form-section-title">Funding reference</h2>
                  <span className="form-section-meta">Virtual account must already be funded</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {FUND_PROOF_TYPES.map((p) => (
                    <label key={p.value} className="radio-pill"
                      style={{
                        padding: '14px 18px', justifyContent: 'flex-start',
                        alignItems: 'flex-start', flexDirection: 'column', gap: 4,
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                        <input type="radio" name="proofType" value={p.value}
                               checked={proofType === p.value}
                               onChange={() => setProofType(p.value)} />
                        <span className="dot" />
                        <span style={{
                          fontWeight: 700, color: 'var(--cs-ink-900)', fontSize: 13.5,
                        }}>{p.label}</span>
                      </div>
                      <div style={{
                        fontSize: 11.5, color: 'var(--cs-ink-100)', paddingLeft: 30,
                      }}>{p.sub}</div>
                    </label>
                  ))}
                </div>
                <div className="form-grid">
                  <div className="field is-mono">
                    <label htmlFor="vaNumber">Linked virtual account number<span className="req">*</span></label>
                    <input id="vaNumber" type="text" required inputMode="numeric"
                           pattern="[0-9]{10}" maxLength={10} placeholder="1234567890"
                           value={vaNumber} onChange={(e) => setVaNumber(e.target.value)} />
                    <div className="help">10-digit NUBAN of the VA linked to this card</div>
                  </div>
                  <div className="field is-mono">
                    <label htmlFor="transferRef">Bank transfer reference<span className="req">*</span></label>
                    <input id="transferRef" type="text" required maxLength={32}
                           placeholder="TRF-2026-009811"
                           value={transferRef} onChange={(e) => setTransferRef(e.target.value)} />
                    <div className="help">Reference printed on the bank transfer receipt</div>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <div className="form-section-head">
                  <h2 className="form-section-title">Reference</h2>
                  <span className="form-section-meta">Optional — appears in audit log</span>
                </div>
                <div className="field">
                  <input id="reference" type="text" maxLength={64}
                         placeholder="e.g. Salary advance — March"
                         value={reference} onChange={(e) => setReference(e.target.value)} />
                </div>
              </section>

              <div className="form-foot">
                <Link to="/portal" className="btn btn-ghost btn-sm">
                  <X /> Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Continue to review <ArrowRight />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

function CardPicker() {
  return (
    <section className="card card-pad-lg" style={{ marginBottom: 18 }}>
      <div className="form-section-head">
        <h2 className="form-section-title">Choose a card</h2>
        <span className="form-section-meta">
          Funds will be loaded to its linked virtual account
        </span>
      </div>
      <div className="card-pick-grid">
        {LOADABLE_CARDS.map((c) => (
          <Link key={c.id} to={`/portal/funds?cardId=${encodeURIComponent(c.id)}`}
                className="card-pick-tile">
            <div className="thumb" />
            <div className="info">
              <div className="pan">{c.maskedPan.replace(/\*/g, '•')}</div>
              <div className="meta">{c.customer} · {c.bank}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
