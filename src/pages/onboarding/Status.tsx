import { Link } from 'react-router-dom'
import {
  ArrowRight, Check, Clock, Download, MessageSquare, RefreshCw,
} from 'lucide-react'
import { useOnboarding } from './OnboardingContext'

const MILESTONES = [
  { k: 'submitted',     label: 'Submitted',     desc: 'Application received',                     when: '30 Apr 2026, 09:14' },
  { k: 'review',        label: 'In Review',     desc: 'Compliance team reviewing your documents', when: '30 Apr 2026, 14:02' },
  { k: 'clarification', label: 'Clarification', desc: 'We need a small piece of extra info',      when: '01 May 2026, 11:20' },
  { k: 'approved',      label: 'Approved',      desc: 'Welcome aboard — credentials issued',      when: '—' },
]

export default function Status() {
  const { state } = useOnboarding()
  const stage = state.statusStage
  const idx = MILESTONES.findIndex((m) => m.k === stage)

  const stageTag =
    stage === 'clarification' ? { cls: 'warn', label: 'Awaiting your response' }
    : stage === 'approved'    ? { cls: 'ok',   label: 'Approved' }
    :                           { cls: 'info', label: 'In review' }

  return (
    <>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 24, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <div>
          <div className="onb-eyebrow">Application</div>
          <h2 className="onb-title">{state.caseId}</h2>
          <p style={{ fontSize: 14, color: 'var(--cs-ink-200)', margin: '4px 0 0' }}>
            Acme Microfinance Bank Ltd · Submitted 30 Apr 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="button" className="onb-btn onb-btn-ghost" style={{ padding: '8px 12px', fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            className="onb-btn onb-btn-secondary"
            style={{ padding: '8px 14px', fontSize: 13 }}
            onClick={() => window.alert('Download summary — not wired in prototype.')}
          >
            <Download size={14} /> Download summary
          </button>
        </div>
      </div>

      {stage === 'clarification' && (
        <div
          className="onb-card pad"
          style={{ borderLeft: '4px solid var(--cs-red-700)', background: 'var(--cs-red-100)', marginBottom: 18 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 999,
              background: '#fff', color: 'var(--cs-red-700)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <MessageSquare size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--cs-red-900)' }}>Clarification requested</div>
              <p style={{ fontSize: 14, color: 'var(--cs-ink-400)', margin: '4px 0 12px', lineHeight: 1.55 }}>
                Compliance asks: "Could you re-upload the proof of address — the file appears partially redacted on page 2."
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/onboarding/respond" className="onb-btn onb-btn-accent">
                  Respond to Clarification <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="onb-card pad">
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22,
        }}>
          <h4 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            color: 'var(--cs-ink-700)', margin: 0,
          }}>
            Timeline
          </h4>
          <span className={`onb-tag ${stageTag.cls}`} style={{ padding: '6px 12px', fontSize: 13 }}>
            ● {stageTag.label}
          </span>
        </div>

        <div style={{ position: 'relative', paddingLeft: 4 }}>
          {MILESTONES.map((m, i) => {
            const done = i < idx
            const active = i === idx
            return (
              <div
                key={m.k}
                style={{
                  display: 'flex', gap: 18,
                  paddingBottom: i < MILESTONES.length - 1 ? 20 : 0,
                  position: 'relative',
                }}
              >
                {i < MILESTONES.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 14, top: 30, bottom: 0,
                    width: 2,
                    background: done ? 'var(--cs-green-500)' : 'var(--cs-line)',
                  }} />
                )}
                <div style={{
                  width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                  background: done ? 'var(--cs-green-500)' : active ? '#fff' : 'var(--cs-mist)',
                  color: done ? '#fff' : active ? 'var(--cs-green-700)' : 'var(--cs-ink-100)',
                  border: `2px solid ${done ? 'var(--cs-green-500)' : active ? 'var(--cs-green-700)' : 'var(--cs-line-strong)'}`,
                  display: 'grid', placeItems: 'center',
                  boxShadow: active ? '0 0 0 4px rgba(43, 161, 93, 0.20)' : 'none',
                }}>
                  {done ? <Check size={14} /> : active ? <Clock size={14} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1, paddingTop: 3 }}>
                  <div style={{
                    fontWeight: 600,
                    color: done || active ? 'var(--cs-ink-700)' : 'var(--cs-ink-100)',
                    fontSize: 15,
                  }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--cs-ink-200)', marginTop: 2 }}>{m.desc}</div>
                  <div style={{ fontSize: 12, color: 'var(--cs-ink-100)', marginTop: 4 }}>{m.when}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
