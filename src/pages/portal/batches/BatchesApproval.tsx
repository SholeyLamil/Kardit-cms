import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Eye } from 'lucide-react'
import { APPROVAL_QUEUE } from './data'

export default function BatchesApproval() {
  const [selectedId, setSelectedId] = useState(APPROVAL_QUEUE[0].id)
  const selected = APPROVAL_QUEUE.find((b) => b.id === selectedId) ?? APPROVAL_QUEUE[0]

  return (
    <main className="scr-main">
      <div className="container">
        <header>
          <div className="title-row">
            <h1 className="page-title">Approval queue</h1>
            <span className="badge pending">3 pending</span>
          </div>
          <p className="page-sub">
            Review batches submitted by your tenant's makers. Approve to begin processing or reject with a reason.
          </p>
        </header>

        <section className="approval-grid" style={{ marginTop: 18 }}>
          <div className="bch-card">
            <div className="card-head">
              <div className="card-head-title">Pending batches</div>
            </div>
            <div className="queue-list">
              {APPROVAL_QUEUE.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={b.id === selectedId ? 'queue-item selected' : 'queue-item'}
                  onClick={() => setSelectedId(b.id)}
                >
                  <div className="queue-row">
                    <span className="queue-id">{b.id}</span>
                    <span className="queue-rows">{b.rows} rows</span>
                  </div>
                  <div className="queue-file">{b.file}</div>
                  <div className="queue-meta">{b.maker} · {b.submittedAt}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bch-card card-pad">
            <div className="row-between" style={{ alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div className="mono" style={{ fontSize: 13, color: 'var(--cs-ink-400)' }}>{selected.id}</div>
                <div style={{ fontSize: 11.5, color: 'var(--cs-ink-100)', marginTop: 2 }}>{selected.file}</div>
              </div>
              <span className="badge pending">PENDING APPROVAL</span>
            </div>

            <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <Row label="Submitted by" value={selected.maker} />
              <Row label="Submitted at" value={selected.submittedAt} />
              <Row label="Card product" value={selected.product} />
              <Row label="Customers to onboard" value={selected.rows.toString()} mono />
              <Row label="Cards to issue" value={selected.rows.toString()} mono />
            </dl>

            <div
              style={{
                marginTop: 20, padding: 12,
                border: '1px solid var(--cs-line)', background: 'var(--cs-paper)',
                borderRadius: 6, fontSize: 11.5,
              }}
            >
              <div style={{ fontWeight: 500, color: 'var(--cs-ink-200)', marginBottom: 4 }}>Maker note</div>
              <div style={{ color: 'var(--cs-ink-400)' }}>{selected.note}</div>
            </div>

            <div className="row-between divider-top" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => window.alert('Row inspector — not wired in prototype.')}
              >
                <Eye /> Inspect rows
              </button>
              <div className="row-end">
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => window.alert('Reject flow — not wired in prototype.')}
                >
                  Reject
                </button>
                <Link className="btn-success" to="/portal/batches/processing">
                  <Check /> Approve and process
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="row-between">
      <dt style={{ color: 'var(--cs-ink-100)' }}>{label}</dt>
      <dd className={mono ? 'tabular' : undefined}>{value}</dd>
    </div>
  )
}
