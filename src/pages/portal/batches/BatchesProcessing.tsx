import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, ChevronRight, Loader2, RefreshCw, XCircle,
} from 'lucide-react'
import { CURRENT_BATCH_ID, PROCESSING_ACTIVITY } from './data'

const TOTAL = 239
const STARTING = 226

export default function BatchesProcessing() {
  const [processed, setProcessed] = useState(STARTING)

  useEffect(() => {
    const t = window.setInterval(() => {
      setProcessed((n) => (n >= TOTAL - 5 ? n : n + 1))
    }, 800)
    return () => window.clearInterval(t)
  }, [])

  const pct = ((processed / TOTAL) * 100).toFixed(1)
  const remaining = TOTAL - processed

  return (
    <main className="scr-main">
      <div className="container">
        <header>
          <nav className="bch-breadcrumbs">
            <Link to="/portal/batches">Batches</Link>
            <ChevronRight />
            <span className="mono" style={{ color: 'var(--cs-ink-200)' }}>{CURRENT_BATCH_ID}</span>
          </nav>
          <div className="row-between" style={{ alignItems: 'flex-end' }}>
            <div>
              <div className="title-row">
                <h1 className="page-title">Processing batch</h1>
                <span className="badge processing">
                  <Loader2 className="spin" style={{ width: 11, height: 11 }} />
                  PROCESSING
                </span>
              </div>
              <p className="page-sub">Customers are being created and cards issued one by one. Safe to leave this page.</p>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.location.reload()}>
              <RefreshCw /> Refresh
            </button>
          </div>
        </header>

        <section className="bch-card card-pad" style={{ marginTop: 18 }}>
          <div className="processing-numbers">
            <div>
              <div className="kpi-label">Progress</div>
              <div className="processing-progress">
                <span>{processed.toLocaleString()}</span>
                <span className="total"> / {TOTAL}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="kpi-label">Complete</div>
              <div className="processing-progress pct">{pct}%</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div
            className="row-between"
            style={{ marginTop: 12, fontSize: 11.5, color: 'var(--cs-ink-100)' }}
          >
            <span>Started 2026-05-06 10:14</span>
            <span>Est. {remaining.toLocaleString()} rows remaining</span>
          </div>
        </section>

        <section className="kpis cols-3" style={{ marginTop: 14 }}>
          <Kpi label="Processed" value={processed.toLocaleString()} valueCls="success" sub="Customer + card created" />
          <Kpi label="Failed" value="4" valueCls="danger" sub="Will be retryable from results" />
          <Kpi label="Remaining" value={Math.max(0, remaining - 4).toString()} sub="In queue" />
        </section>

        <section className="bch-card" style={{ marginTop: 14 }}>
          <div className="card-head">
            <div className="card-head-title">Recent activity</div>
            <div className="gap-2" style={{ fontSize: 11.5, color: 'var(--cs-ink-100)' }}>
              <span className="live-dot" /> Live
            </div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Row</th>
                <th>Customer</th>
                <th>Customer ID</th>
                <th>Card ID</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {PROCESSING_ACTIVITY.map((a) => (
                <tr key={a.row}>
                  <td className="id">{a.row}</td>
                  <td>{a.customer}</td>
                  <td className="id">{a.custId}</td>
                  <td className="id">{a.cardId}</td>
                  <td>
                    <span className={`result-pill ${a.status}`}>
                      {a.status === 'success' && <CheckCircle2 />}
                      {a.status === 'failed' && <XCircle />}
                      {a.status === 'processing' && <Loader2 className="spin" />}
                      {a.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="row-end" style={{ marginTop: 14 }}>
          <Link className="btn btn-primary" to="/portal/batches/result">
            Skip ahead to result summary <ChevronRight />
          </Link>
        </div>
      </div>
    </main>
  )
}

function Kpi({ label, value, sub, valueCls }: { label: string; value: string; sub: string; valueCls?: string }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={valueCls ? `kpi-value ${valueCls}` : 'kpi-value'}>{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  )
}
