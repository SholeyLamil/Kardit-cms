import { Link } from 'react-router-dom'
import { ChevronRight, Download, RefreshCw, Upload } from 'lucide-react'
import { CURRENT_BATCH_ID, FAILURE_CLUSTERS, RESULT_RECORDS } from './data'

export default function BatchesResult() {
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
                <h1 className="page-title">Batch complete</h1>
                <span className="badge partial">PARTIAL</span>
              </div>
              <p className="page-sub">Finished at 2026-05-06 10:47 · 33 min duration</p>
            </div>
            <div className="row-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => window.alert('Full results CSV — not wired in prototype.')}
              >
                <Download /> Full results CSV
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.alert('Failed rows CSV — not wired in prototype.')}
              >
                <Download /> Failed rows only
              </button>
            </div>
          </div>
        </header>

        <section className="kpis" style={{ marginTop: 14 }}>
          <Kpi label="Total submitted" value="239" sub="Valid rows from upload" />
          <Kpi label="Successful" value="235" valueCls="success" sub="98.3% success rate" />
          <Kpi label="Failed" value="4" valueCls="danger" sub="Retryable from this page" />
          <Kpi label="Cards issued" value="235" sub="With customers created" />
        </section>

        <section className="bch-card card-pad" style={{ marginTop: 14 }}>
          <h2 className="bch-label" style={{ marginBottom: 12 }}>Failure breakdown</h2>
          {FAILURE_CLUSTERS.map((f) => (
            <div key={f.code} className="failure-cluster">
              <div className="failure-info">
                <div className="failure-count">{f.count}</div>
                <div>
                  <div className="failure-code">{f.code}</div>
                  <div className="failure-desc">{f.desc}</div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => window.alert(`Retry ${f.code} — not wired in prototype.`)}
              >
                <RefreshCw /> Retry
              </button>
            </div>
          ))}
        </section>

        <section className="bch-card" style={{ marginTop: 14 }}>
          <div className="card-head">
            <div className="card-head-title">Created records</div>
            <span style={{ fontSize: 11.5, color: 'var(--cs-ink-100)' }}>Showing latest 5 of 235</span>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Row</th>
                <th>Customer</th>
                <th>Customer ID</th>
                <th>Card ID</th>
                <th>Card status</th>
              </tr>
            </thead>
            <tbody>
              {RESULT_RECORDS.map((r) => (
                <tr key={r.row}>
                  <td className="id">{r.row}</td>
                  <td>{r.customer}</td>
                  <td className="id">{r.custId}</td>
                  <td className="id">{r.cardId}</td>
                  <td><span className="badge uploaded">PERSONALIZING</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="row-end divider-top" style={{ marginTop: 20 }}>
          <Link className="btn btn-ghost" to="/portal/batches">Back to batches</Link>
          <Link className="btn btn-primary" to="/portal/batches/upload">
            <Upload /> Start a new batch
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
