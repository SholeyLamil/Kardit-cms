import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, FileText, Upload } from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

export default function Respond() {
  const { setStatusStage } = useOnboarding()
  const navigate = useNavigate()
  const [msg, setMsg] = useState('')
  const [file, setFile] = useState<boolean>(false)

  function submit() {
    setStatusStage('review')
    navigate('/onboarding/status')
  }

  return (
    <>
      <Link
        to="/onboarding/status"
        className="onb-btn onb-btn-ghost"
        style={{ marginBottom: 14, padding: '6px 10px', fontSize: 13 }}
      >
        <ChevronLeft size={14} /> Back to status
      </Link>

      <div className="onb-eyebrow">Clarification</div>
      <h2 className="onb-title">Respond to compliance</h2>
      <p className="onb-sub">
        Reply to our message and re-upload any missing or corrected documents. Your application
        stays in clarification status until you submit a response.
      </p>

      <div className="onb-card pad" style={{ background: 'var(--cs-mist)' }}>
        <div style={{
          fontSize: 12, color: 'var(--cs-ink-100)',
          textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
        }}>
          Original request · 01 May, 11:20
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--cs-ink-400)', lineHeight: 1.55 }}>
          "Could you re-upload the proof of address — the file appears partially redacted on page 2."
        </p>
      </div>

      <div className="onb-card pad" style={{ marginTop: 14 }}>
        <h4 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 16, color: 'var(--cs-ink-700)', margin: '0 0 14px',
        }}>
          Your reply
        </h4>
        <div className="onb-field">
          <label>Message</label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={5}
            placeholder="Add a short note for the compliance team..."
            style={{ resize: 'vertical', minHeight: 120 }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="onb-field">
            <label>Re-upload document</label>
            <div style={{
              border: '2px dashed var(--cs-line-strong)',
              borderRadius: 12, padding: 22, textAlign: 'center',
              background: 'var(--cs-paper)',
            }}>
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <FileText size={20} color="var(--cs-green-700)" />
                  <span style={{ fontWeight: 600, color: 'var(--cs-ink-700)' }}>proof_of_address_v2.pdf</span>
                  <span style={{ fontSize: 12, color: 'var(--cs-ink-100)' }}>1.4 MB</span>
                  <button
                    type="button"
                    className="onb-btn onb-btn-ghost"
                    style={{ padding: '4px 10px', fontSize: 12, color: 'var(--cs-red-700)' }}
                    onClick={() => setFile(false)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} color="var(--cs-ink-100)" />
                  <div style={{ fontWeight: 600, color: 'var(--cs-ink-700)', marginTop: 8 }}>
                    Drop file here or click to browse
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--cs-ink-100)', marginTop: 4 }}>
                    PDF, JPG, PNG · max 5MB
                  </div>
                  <button
                    type="button"
                    className="onb-btn onb-btn-secondary"
                    style={{ marginTop: 12, padding: '8px 14px', fontSize: 13 }}
                    onClick={() => setFile(true)}
                  >
                    Browse files
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="onb-step-actions">
        <Link to="/onboarding/status" className="onb-btn onb-btn-ghost">Cancel</Link>
        <button
          type="button"
          className="onb-btn onb-btn-primary"
          disabled={!msg && !file}
          onClick={submit}
        >
          Submit response <ArrowRight size={16} />
        </button>
      </div>
    </>
  )
}
