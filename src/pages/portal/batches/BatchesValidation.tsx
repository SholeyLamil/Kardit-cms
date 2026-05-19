import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Download } from 'lucide-react'
import { CURRENT_BATCH_ID, VALIDATION_ERRORS } from './data'

export default function BatchesValidation() {
  return (
    <main className="scr-main">
      <div className="container">
        <header>
          <nav className="bch-breadcrumbs">
            <Link to="/portal/batches">Batches</Link>
            <ChevronRight />
            <span className="mono" style={{ color: 'var(--cs-ink-200)' }}>{CURRENT_BATCH_ID}</span>
            <ChevronRight />
            <span style={{ color: 'var(--cs-ink-400)' }}>Validation</span>
          </nav>
          <div className="row-between" style={{ alignItems: 'flex-end' }}>
            <div>
              <div className="title-row">
                <h1 className="page-title">Validation summary</h1>
                <span className="badge validated">VALIDATED</span>
              </div>
              <p className="page-sub">
                <span className="mono">lagos_branch_onboarding_w18.csv</span> · Verve Prepaid Standard · uploaded 2026-05-06 10:14
              </p>
            </div>
          </div>
        </header>

        <section className="kpis cols-3" style={{ marginTop: 14 }}>
          <Kpi label="Total rows" value="247" sub="In uploaded file" />
          <Kpi label="Valid" value="239" valueCls="success" sub="96.8% pass rate" />
          <Kpi label="Invalid" value="8" valueCls="danger" sub="Will be skipped on submit" />
        </section>

        <section className="bch-card" style={{ marginTop: 20 }}>
          <div className="card-head">
            <div>
              <div className="card-head-title">Invalid rows</div>
              <div className="card-head-sub">Fix and re-upload, or proceed and these rows will be skipped.</div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => window.alert('Error report download — not wired in prototype.')}
            >
              <Download /> Download error report
            </button>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Row</th>
                <th>Customer</th>
                <th>Error code</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_ERRORS.map((e, i) => (
                <tr key={i}>
                  <td className="id">{e.row}</td>
                  <td>{e.customer}</td>
                  <td><span className="badge error-code">{e.code}</span></td>
                  <td className="meta">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="row-between divider-top" style={{ marginTop: 20 }}>
          <Link className="btn btn-ghost" to="/portal/batches/upload">
            <ArrowLeft /> Re-upload corrected file
          </Link>
          <div className="row-end">
            <Link className="btn btn-ghost" to="/portal/batches">Save and exit</Link>
            <Link className="btn btn-primary" to="/portal/batches/submit">
              Continue with 239 valid rows <ChevronRight />
            </Link>
          </div>
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
