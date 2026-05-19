import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle, ArrowLeft, ChevronDown, ChevronRight, Download, FileText, Upload as UploadIcon, X,
} from 'lucide-react'

const PRODUCTS = [
  { id: 'PRD-PREPAID-001', name: 'Verve Prepaid Standard' },
  { id: 'PRD-VIRTUAL-002', name: 'Mastercard Virtual Lite' },
  { id: 'PRD-PREPAID-003', name: 'Verve Prepaid Premium' },
]

export default function BatchesUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [productId, setProductId] = useState(PRODUCTS[0].id)
  const navigate = useNavigate()

  return (
    <main className="scr-main">
      <div className="container container--narrow">
        <header>
          <Link to="/portal/batches" className="back-link">
            <ArrowLeft /> Back to batch dashboard
          </Link>
          <h1 className="page-title">New batch upload</h1>
          <p className="page-sub">Upload a CSV or XLSX file containing customer details for bulk card issuance.</p>
        </header>

        <section
          className="bch-card card-pad-lg"
          style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 18 }}
        >
          <div>
            <label className="bch-label" htmlFor="product">Card product</label>
            <div className="select-wrap">
              <select
                id="product"
                className="bch-select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} · {p.id}</option>
                ))}
              </select>
              <ChevronDown />
            </div>
            <p className="help-text">Determines BIN range, fees, and issuing bank for every card in this batch.</p>
          </div>

          <div>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <label className="bch-label" style={{ marginBottom: 0 }}>Batch file</label>
              <a
                href="#template"
                onClick={(e) => { e.preventDefault(); window.alert('CSV template download — not wired in prototype.') }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--cs-green-900)' }}
              >
                <Download style={{ width: 12, height: 12 }} /> Download CSV template
              </a>
            </div>
            <label
              className={file ? 'dropzone has-file' : 'dropzone'}
              htmlFor="file-input"
            >
              {file ? (
                <div className="file-pill">
                  <div className="file-icon"><FileText /></div>
                  <div className="file-meta">
                    <div className="file-name">{file.name}</div>
                    <div className="file-detail">{(file.size / 1024).toFixed(1)} KB · ready to upload</div>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Remove file"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <div className="dropzone-prompt">
                  <UploadIcon />
                  <div className="dropzone-prompt-main">Drop CSV or XLSX here, or click to browse</div>
                  <div className="dropzone-prompt-sub">Up to 10,000 rows · 25 MB max · file structure must match the template</div>
                </div>
              )}
            </label>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) setFile(f)
              }}
            />
          </div>

          <div className="notice info">
            <AlertCircle />
            <div>
              <span className="strong">File requirements: </span>
              Header row required. Required columns:{' '}
              <span className="mono" style={{ color: 'var(--cs-ink-400)' }}>
                firstName, lastName, dateOfBirth, phone, bvn, address.lga, address.state
              </span>. See template for full schema.
            </div>
          </div>

          <div className="row-end divider-top">
            <Link className="btn btn-ghost" to="/portal/batches">Cancel</Link>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!file}
              style={file ? undefined : { opacity: 0.4, pointerEvents: 'none' }}
              onClick={() => navigate('/portal/batches/validation')}
            >
              Upload &amp; validate <ChevronRight />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
