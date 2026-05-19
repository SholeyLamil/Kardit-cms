import { Link } from 'react-router-dom'
import { ArrowRight, Info, UserCog } from 'lucide-react'
import { AFFILIATES, BANK, KPI } from './data'

export default function BankPortfolio() {
  return (
    <main className="scr-main">
      <div className="container">
        <div className="persona-banner">
          <div className="icn"><UserCog /></div>
          <div>
            <div className="title">Demo: Issuing Bank role</div>
            <div className="sub">
              You are viewing Kardit as <strong>Chioma N.</strong>, an Issuing Bank user
              at Zenith Bank. Read-only scope — see all affiliates with cards under your bank.
            </div>
          </div>
          <Link to="/portal" className="switch">Switch back to Affiliate →</Link>
        </div>

        <div className="bank-hero">
          <div className="bank-logo">{BANK.shortName}</div>
          <div style={{ flex: 1 }}>
            <div className="bank-name">{BANK.name}</div>
            <div className="bank-meta">
              Issuing bank · {BANK.code}
              <span className="pill">{BANK.cardsLive} cards live</span>
            </div>
          </div>
        </div>

        <section>
          <div className="section-head" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">Today at a glance</div>
              <div className="section-sub">Bank-scoped KPIs across all affiliates</div>
            </div>
          </div>

          <div className="kpi-stub">
            <Kpi label="Cards issued" value={KPI.cardsIssued} sub={`across ${BANK.affiliates} affiliates`} />
            <Kpi label="Active" value={KPI.active} sub={KPI.activeSub} />
            <Kpi label="Frozen" value={KPI.frozen} sub={KPI.frozenSub} valueStyle={{ color: '#1B547F' }} />
            <Kpi label="Terminated" value={KPI.terminated} sub={KPI.terminatedSub} valueStyle={{ color: 'var(--cs-ink-200)' }} />
          </div>

          <div className="kpi-stub" style={{ marginTop: 14 }}>
            <Kpi label="Funding volume" value={KPI.funding} sub="today · all affiliates" />
            <Kpi label="Unload volume" value={KPI.unload} sub="today · all affiliates" />
            <Kpi label="Txn volume" value={KPI.txnVol} sub="card spend today" />
            <Kpi label="Pending maker-checker" value={KPI.pendingMc} sub="awaiting reconciliation" />
          </div>

          <div className="kpi-stub" style={{ marginTop: 14, gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <div className="kpi" style={{ gridColumn: '1 / span 2' }}>
              <div className="kpi-label">Failed CMS requests</div>
              <div className="kpi-value" style={{ color: 'var(--cs-red-700)' }}>{KPI.failedCms}</div>
              <div className="kpi-sub">{KPI.failedSub}</div>
            </div>
            <div className="kpi" style={{ gridColumn: '3 / span 2' }}>
              <div className="kpi-label">Generated at</div>
              <div className="kpi-value" style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>
                {KPI.generatedAt}
              </div>
              <div className="kpi-sub">refresh interval 5 min</div>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          <div className="section-head" style={{ marginBottom: 14 }}>
            <div>
              <div className="section-title">Affiliates issuing under Zenith</div>
              <div className="section-sub">Click an affiliate to drill into their portfolio · read-only</div>
            </div>
          </div>
          <div className="aff-table">
            <table>
              <thead>
                <tr>
                  <th>Affiliate</th>
                  <th>Tenant ID</th>
                  <th className="right">Cards issued</th>
                  <th className="right">Active</th>
                  <th className="right">Funding today</th>
                  <th className="right">Health</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {AFFILIATES.map((a) => (
                  <tr key={a.tenantId}>
                    <td>
                      <div className="aff-name">{a.name}</div>
                      <div className="aff-sub">{a.onboarded}</div>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: 11.5, color: 'var(--cs-ink-200)' }}>
                        {a.tenantId}
                      </span>
                    </td>
                    <td className="right num">{a.cardsIssued.toLocaleString()}</td>
                    <td className="right num">{a.active.toLocaleString()}</td>
                    <td className="right num">{a.fundingToday}</td>
                    <td className="right">
                      <span className={`kyc-pill ${a.health}`}>{a.healthLabel}</span>
                    </td>
                    <td className="right">
                      <a
                        href="#open"
                        className="row-btn"
                        onClick={(e) => {
                          e.preventDefault()
                          window.alert('Affiliate drill-down — coming later.')
                        }}
                      >
                        <ArrowRight /> Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="notice info" style={{ marginTop: 24 }}>
          <Info />
          <div>
            <span className="strong">Scope enforcement.</span>{' '}
            As an Issuing Bank user you only see affiliates with cards issued under{' '}
            <strong>Zenith Bank</strong> ({BANK.code}). You cannot freeze, unfreeze, or load —
            those are Affiliate actions.
          </div>
        </div>
      </div>
    </main>
  )
}

function Kpi({
  label, value, sub, valueStyle,
}: { label: string; value: string; sub: React.ReactNode; valueStyle?: React.CSSProperties }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={valueStyle}>{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  )
}
