import { Link } from 'react-router-dom'
import { Eye, Filter, Loader2, RefreshCw, Search, Upload } from 'lucide-react'
import { RECENT_BATCHES, BatchStatus } from './data'

const STATUS_CLASS: Record<BatchStatus, string> = {
  PROCESSING: 'processing',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PENDING: 'pending',
}

export default function BatchesDashboard() {
  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Batch issuance</h1>
            <p className="page-sub">Upload customer files to onboard and issue cards in bulk.</p>
          </div>
          <div className="row-end">
            <button className="btn btn-ghost" type="button" onClick={() => window.location.reload()}>
              <RefreshCw /> Refresh
            </button>
            <Link className="btn btn-primary" to="/portal/batches/upload">
              <Upload /> New batch
            </Link>
          </div>
        </header>

        <section className="kpis" style={{ marginTop: 14 }}>
          <Kpi label="Active jobs" value="3" sub="2 processing · 1 pending approval" />
          <Kpi label="This week" value="1,241" sub="Customers onboarded" />
          <Kpi label="Cards issued" value="1,198" valueCls="success" sub="96.5% success rate" />
          <Kpi label="Failed rows" value="43" valueCls="warning" sub="Across 7 batches" />
        </section>

        <section className="bch-card" style={{ marginTop: 20 }}>
          <div className="card-head">
            <div className="card-head-title">Recent batch jobs</div>
            <div className="row-end">
              <div className="search-wrap">
                <Search />
                <input className="bch-input bch-input-sm" placeholder="Search batch ID or filename" />
              </div>
              <button className="btn btn-ghost btn-sm" type="button">
                <Filter /> Status
              </button>
            </div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>File</th>
                <th>Product</th>
                <th>Submitted</th>
                <th>Maker</th>
                <th className="right">Rows</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {RECENT_BATCHES.map((b) => {
                const linkTo = b.status === 'PROCESSING' ? '/portal/batches/processing' : '/portal/batches/result'
                return (
                  <tr key={b.id}>
                    <td className="id">{b.id}</td>
                    <td className="meta">{b.file}</td>
                    <td className="meta">{b.product}</td>
                    <td className="meta">{b.submitted}</td>
                    <td>{b.maker}</td>
                    <td className="right tabular">{b.rows}</td>
                    <td>
                      <span className={`badge ${STATUS_CLASS[b.status]}`}>
                        {b.status === 'PROCESSING' && <Loader2 className="spin" style={{ width: 11, height: 11 }} />}
                        {b.status}
                      </span>
                    </td>
                    <td className="right">
                      <Link to={linkTo} className="icon-button" style={{ marginLeft: 'auto' }}>
                        <Eye />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
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
