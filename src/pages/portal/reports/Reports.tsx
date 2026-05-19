import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2, Download, FileText, Info, Loader2, Table,
} from 'lucide-react'
import { RANGES, RECENT_REPORTS, REPORTS, newJobId } from './data'

type Phase = 'idle' | 'queued' | 'generating' | 'ready'

type ReportState = {
  phase: Phase
  fmt?: 'csv' | 'xlsx'
  jobId?: string
}

export default function Reports() {
  const [states, setStates] = useState<Record<string, ReportState>>({})
  const [ranges, setRanges] = useState<Record<string, string>>({})
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  function generate(id: string, fmt: 'csv' | 'xlsx') {
    const jobId = newJobId()
    setStates((s) => ({ ...s, [id]: { phase: 'queued', fmt, jobId } }))
    const t1 = window.setTimeout(() => {
      setStates((s) => ({ ...s, [id]: { phase: 'generating', fmt, jobId } }))
    }, 700)
    const t2 = window.setTimeout(() => {
      setStates((s) => ({ ...s, [id]: { phase: 'ready', fmt, jobId } }))
    }, 2000)
    timers.current.push(t1, t2)
  }

  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-sub">
              Generate and download operational reports for Kardit Lagos.
            </p>
          </div>
        </header>

        <div className="reports-grid">
          {REPORTS.map((r) => {
            const Icon = r.icon
            const st = states[r.id] ?? { phase: 'idle' as Phase }
            const busy = st.phase === 'queued' || st.phase === 'generating'
            const range = ranges[r.id] ?? RANGES[0].v
            return (
              <div key={r.id} className="report-card">
                <div className="report-head">
                  <div className="report-icon"><Icon /></div>
                  <div>
                    <div className="report-title">{r.name}</div>
                    <div className="report-meta">{r.format}</div>
                  </div>
                </div>
                <div className="report-desc">{r.desc}</div>
                <div className="report-controls">
                  <select
                    value={range}
                    onChange={(e) => setRanges((s) => ({ ...s, [r.id]: e.target.value }))}
                    aria-label={`Date range for ${r.name}`}
                  >
                    {RANGES.map((rg) => (
                      <option key={rg.v} value={rg.v}>{rg.l}</option>
                    ))}
                  </select>
                </div>
                <div className="report-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={busy}
                    onClick={() => generate(r.id, 'csv')}
                  >
                    <FileText /> CSV
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => generate(r.id, 'xlsx')}
                  >
                    <Table /> XLSX
                  </button>
                </div>
                <div className={st.phase === 'ready' ? 'report-status success' : 'report-status'}>
                  {st.phase === 'queued' && (
                    <>
                      <Loader2 className="spin" /> Queued · job {st.jobId}
                    </>
                  )}
                  {st.phase === 'generating' && (
                    <>
                      <Loader2 className="spin" /> Generating {st.fmt?.toUpperCase()}…
                    </>
                  )}
                  {st.phase === 'ready' && (
                    <>
                      <CheckCircle2 /> Ready ·{' '}
                      <a
                        href="#download"
                        onClick={(e) => {
                          e.preventDefault()
                          window.alert(`Streamed download for job ${st.jobId} (${st.fmt?.toUpperCase()}).`)
                        }}
                        style={{
                          color: 'var(--cs-green-700)',
                          fontWeight: 700,
                          textDecoration: 'underline',
                        }}
                      >
                        download {st.fmt?.toUpperCase()}
                      </a>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="recent-reports">
          <div className="recent-reports-head">
            <span
              className="panel-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--cs-ink-700)',
              }}
            >
              Recently generated
            </span>
            <span style={{ fontSize: 11, color: 'var(--cs-ink-100)' }}>Retained 30 days</span>
          </div>
          {RECENT_REPORTS.map((r, i) => (
            <div key={i} className="recent-reports-row">
              <span className="name">{r.name}</span>
              <span className="range">{r.range}</span>
              <span className="ts">{r.ts}</span>
              <a
                href="#redownload"
                onClick={(e) => {
                  e.preventDefault()
                  window.alert('Re-download would stream the cached file.')
                }}
                className="btn btn-ghost btn-sm"
              >
                <Download /> Download
              </a>
            </div>
          ))}
        </div>

        <div className="notice info" style={{ marginTop: 24 }}>
          <Info />
          <div>
            <span className="strong">Report generation is asynchronous.</span>{' '}
            Generate kicks off a background job. You can navigate away and come back — the file
            shows up in <strong>Recently generated</strong> when it's ready.
          </div>
        </div>
      </div>
    </main>
  )
}
