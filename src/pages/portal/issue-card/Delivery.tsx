import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useIssueCard } from './IssueCardContext'

type Method = 'Direct dispatch' | 'Courier' | 'Branch pickup'

export default function Delivery() {
  const navigate = useNavigate()
  const { state, patch } = useIssueCard()

  if (!state.customerId || !state.customer) {
    return <Navigate to="/portal/issue-card" replace />
  }
  if (state.productType === 'VIRTUAL') {
    return <Navigate to="/portal/issue-card/review" replace />
  }

  const c = state.customer
  const [method, setMethod] = useState<Method>(state.delivery?.method ?? 'Direct dispatch')
  const [useDefault, setUseDefault] = useState<boolean>(state.delivery?.useDefault ?? true)
  const [altStreet, setAltStreet] = useState(state.delivery?.altStreet ?? '')
  const [altLga, setAltLga] = useState(state.delivery?.altLga ?? '')
  const [altState, setAltState] = useState(state.delivery?.altState ?? 'Lagos')
  const [notes, setNotes] = useState(state.delivery?.notes ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    patch({
      delivery: {
        method,
        useDefault,
        altStreet: useDefault ? null : altStreet || null,
        altLga: useDefault ? null : altLga || null,
        altState: useDefault ? null : altState || null,
        notes: notes || null,
      },
    })
    navigate('/portal/issue-card/review')
  }

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header className="page-head">
          <div>
            <h1 className="page-title">Delivery details</h1>
            <p className="page-sub">
              Physical cards are personalized by the bureau and dispatched. Default address is
              the customer's; switch if delivery should go elsewhere.
            </p>
          </div>
        </header>

        <form onSubmit={onSubmit} className="card card-pad-lg" autoComplete="off">
          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Method</h2>
              <span className="form-section-meta">Required</span>
            </div>
            <div className="radio-group" style={{ gap: 12 }}>
              {(['Direct dispatch', 'Courier', 'Branch pickup'] as Method[]).map((m) => (
                <label key={m} className="radio-pill" style={{ padding: '14px 18px' }}>
                  <input type="radio" name="method" value={m}
                         checked={method === m} onChange={() => setMethod(m)} />
                  <span className="dot" /> {labelFor(m)}
                </label>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Address</h2>
              <span className="form-section-meta">Defaults to customer address</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              background: 'var(--cs-paper)', border: '1px solid var(--cs-line)',
              borderRadius: 'var(--cs-radius-md)',
            }}>
              <input
                id="use-default-addr" type="checkbox"
                checked={useDefault} onChange={(e) => setUseDefault(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="use-default-addr" style={{ fontSize: 13.5, cursor: 'pointer' }}>
                Use customer address — <span style={{ color: 'var(--cs-ink-200)' }}>
                  {c.street}, {c.lga}, {c.state}
                </span>
              </label>
            </div>

            {!useDefault && (
              <div style={{ marginTop: 16 }}>
                <div className="form-grid">
                  <div className="field form-row-full">
                    <label htmlFor="altStreet">Street address</label>
                    <input id="altStreet" type="text" value={altStreet}
                           onChange={(e) => setAltStreet(e.target.value)}
                           placeholder="42 Marina Road" />
                  </div>
                  <div className="field">
                    <label htmlFor="altLga">LGA</label>
                    <input id="altLga" type="text" value={altLga}
                           onChange={(e) => setAltLga(e.target.value)}
                           placeholder="Lagos Island" />
                  </div>
                  <div className="field">
                    <label htmlFor="altState">State</label>
                    <select id="altState" value={altState}
                            onChange={(e) => setAltState(e.target.value)}>
                      <option value="Lagos">Lagos</option>
                      <option value="FCT — Abuja">FCT — Abuja</option>
                      <option value="Rivers">Rivers</option>
                      <option value="Kano">Kano</option>
                      <option value="Oyo">Oyo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Special instructions</h2>
              <span className="form-section-meta">Optional</span>
            </div>
            <div className="field">
              <textarea
                rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. Call upon arrival. Leave with security at gate house."
                style={{
                  background: 'var(--cs-white)', border: '1px solid var(--cs-line-strong)',
                  borderRadius: 'var(--cs-radius-sm)', padding: '10px 13px', fontSize: 13.5,
                  fontFamily: 'inherit', width: '100%', outline: 'none', resize: 'vertical',
                  lineHeight: 1.5,
                }}
              />
            </div>
          </section>

          <div className="form-foot">
            <Link to="/portal/issue-card/card" className="btn btn-ghost btn-sm">
              <ArrowLeft /> Back
            </Link>
            <button type="submit" className="btn btn-primary">
              Continue to review <ArrowRight />
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

function labelFor(m: Method): string {
  switch (m) {
    case 'Direct dispatch': return 'Direct dispatch · Lagos & FCT only · 3–5 days'
    case 'Courier': return 'Courier · nationwide · 5–10 days'
    case 'Branch pickup': return 'Branch pickup · 2–4 days, ID required at collection'
  }
}
