import { Link } from 'react-router-dom'
import { ArrowRight, Check, FileText, RefreshCcw, Trash2, Upload } from 'lucide-react'
import { useOnboarding, type DocsState } from './OnboardingContext'

type DocKey = keyof DocsState

const REQUIRED: { key: DocKey; label: string; desc: string }[] = [
  { key: 'cac',       label: 'CAC Certificate',       desc: 'Certificate of Incorporation (PDF, max 5MB)' },
  { key: 'memart',    label: 'Memorandum & Articles', desc: 'MEMART or constitution document' },
  { key: 'tin',       label: 'TIN Certificate',       desc: 'Tax Identification Number certificate' },
  { key: 'directors', label: 'Director ID(s)',        desc: 'Government-issued ID for each director' },
  { key: 'utility',   label: 'Proof of Address',      desc: 'Utility bill, dated within 3 months' },
]

export default function Docs() {
  const { state, setDocs } = useOnboarding()
  const docs = state.docs

  function toggle(k: DocKey) {
    setDocs({
      ...docs,
      [k]: docs[k] ? null : { name: `${k}_certificate.pdf`, size: '1.2 MB' },
    })
  }

  const uploadedCount = Object.values(docs).filter(Boolean).length

  return (
    <>
      <div className="onb-eyebrow">Step 2 of 4</div>
      <h2 className="onb-title">Upload required documents</h2>
      <p className="onb-sub">All documents must be in PDF, JPG or PNG format and under 5MB. We accept clear scans or smartphone photos.</p>

      <div
        className="onb-card pad"
        style={{
          borderStyle: 'dashed',
          borderColor: 'var(--cs-green-300)',
          background: 'var(--cs-green-100)',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: '#fff', color: 'var(--cs-green-700)',
            display: 'grid', placeItems: 'center',
          }}>
            <Upload size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--cs-ink-900)' }}>Drag and drop files here</div>
            <div style={{ fontSize: 13, color: 'var(--cs-ink-200)', marginTop: 2 }}>
              or click to browse — we'll auto-detect document type where possible.
            </div>
          </div>
          <button
            type="button"
            className="onb-btn onb-btn-secondary"
            onClick={() => window.alert('Browse files — not wired in prototype.')}
          >
            Browse files
          </button>
        </div>
      </div>

      <div className="onb-card">
        <div style={{
          padding: '14px 22px',
          borderBottom: '1px solid var(--cs-line)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--cs-ink-700)' }}>
            Required documents ({uploadedCount}/{REQUIRED.length})
          </div>
          <span className="onb-tag info">{REQUIRED.length - uploadedCount} remaining</span>
        </div>
        {REQUIRED.map((d, i) => {
          const file = docs[d.key]
          return (
            <div
              key={d.key}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 22px',
                borderBottom: i < REQUIRED.length - 1 ? '1px solid var(--cs-line)' : 'none',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: file ? 'var(--cs-green-100)' : 'var(--cs-mist)',
                color: file ? 'var(--cs-green-700)' : 'var(--cs-ink-100)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                {file ? <Check size={18} /> : <FileText size={18} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--cs-ink-700)' }}>{d.label}</div>
                <div style={{ fontSize: 12, color: 'var(--cs-ink-100)', marginTop: 2 }}>
                  {file ? (
                    <>
                      <strong style={{ color: 'var(--cs-ink-400)' }}>{file.name}</strong> · {file.size} · uploaded
                    </>
                  ) : (
                    d.desc
                  )}
                </div>
              </div>
              {file ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className="onb-btn onb-btn-ghost"
                    style={{ padding: '6px 10px', fontSize: 12 }}
                    onClick={() => toggle(d.key)}
                  >
                    <RefreshCcw size={14} /> Replace
                  </button>
                  <button
                    type="button"
                    className="onb-btn onb-btn-ghost"
                    style={{ padding: '6px 10px', fontSize: 12, color: 'var(--cs-red-700)' }}
                    onClick={() => toggle(d.key)}
                    aria-label={`Remove ${d.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="onb-btn onb-btn-secondary"
                  style={{ padding: '8px 14px', fontSize: 13 }}
                  onClick={() => toggle(d.key)}
                >
                  Upload
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="onb-step-actions">
        <Link to="/onboarding/org" className="onb-btn onb-btn-ghost">← Back</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/onboarding" className="onb-btn onb-btn-secondary">Save Draft</Link>
          <Link to="/onboarding/banks" className="onb-btn onb-btn-primary">
            Next: Banks <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
