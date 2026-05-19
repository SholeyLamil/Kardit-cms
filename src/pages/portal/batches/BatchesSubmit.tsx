import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, ChevronRight } from 'lucide-react'
import { CURRENT_BATCH_ID } from './data'

export default function BatchesSubmit() {
  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header>
          <nav className="bch-breadcrumbs">
            <Link to="/portal/batches">Batches</Link>
            <ChevronRight />
            <span className="mono" style={{ color: 'var(--cs-ink-200)' }}>{CURRENT_BATCH_ID}</span>
            <ChevronRight />
            <span style={{ color: 'var(--cs-ink-400)' }}>Submit for approval</span>
          </nav>
          <h1 className="page-title">Submit batch for approval</h1>
          <p className="page-sub">A checker in your tenant will review and approve before processing begins.</p>
        </header>

        <section className="bch-card card-pad-lg" style={{ marginTop: 18 }}>
          <h2 className="bch-label" style={{ marginBottom: 16 }}>Batch summary</h2>
          <dl className="specs">
            <div><dt>Batch ID</dt><dd className="mono">{CURRENT_BATCH_ID}</dd></div>
            <div><dt>Source file</dt><dd className="mono" style={{ fontSize: 11.5 }}>lagos_branch_onboarding_w18.csv</dd></div>
            <div><dt>Card product</dt><dd>Verve Prepaid Standard</dd></div>
            <div><dt>Issuing bank</dt><dd>First City Monument Bank</dd></div>
            <div><dt>Total rows</dt><dd>247</dd></div>
            <div><dt>Valid rows to process</dt><dd className="success">239</dd></div>
            <div><dt>Invalid (skipped)</dt><dd className="danger">8</dd></div>
            <div><dt>Maker</dt><dd>Adaeze Okafor</dd></div>
          </dl>

          <div className="notice warning" style={{ marginTop: 24 }}>
            <AlertCircle />
            <div>
              <span className="strong">Once submitted, this batch enters the approval queue.</span>{' '}
              A different user with checker rights must approve before 239 customers and cards are
              created. You won't be able to edit the file after this point.
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <label className="bch-label" htmlFor="checker-note">Note for checker (optional)</label>
            <textarea
              id="checker-note"
              className="bch-input"
              rows={3}
              placeholder="e.g. Lagos branch onboarding for week 18. 8 invalid rows are duplicates from last week's batch — safe to skip."
            />
          </div>
        </section>

        <div className="row-between divider-top" style={{ marginTop: 20 }}>
          <Link className="btn btn-ghost" to="/portal/batches/validation">
            <ArrowLeft /> Back to validation
          </Link>
          <Link className="btn btn-primary btn-lg" to="/portal/batches/approval">
            Submit for approval
          </Link>
        </div>
      </div>
    </main>
  )
}
