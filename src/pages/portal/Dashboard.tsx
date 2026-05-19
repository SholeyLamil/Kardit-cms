import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  UserPlus,
  UploadCloud,
  Search,
  CreditCard,
  Wallet,
  BarChart3,
  Building2,
  ArrowRight,
  RefreshCw,
  Loader2,
  Snowflake,
  CheckCheck,
} from 'lucide-react'
import './Dashboard.css'

type Range = 'today' | 'week' | 'month' | 'custom'

const KPI_DATA: Record<Range, {
  issued: string; added: string; active: string; frozen: string; terminated: string;
  funding: string; trend: string; unload: string; txnvol: string; txncount: string;
  pending: string; failed: string;
}> = {
  today:  { issued:'1,247', added:'+18',  active:'1,089', frozen:'38',  terminated:'120', funding:'₦18.4M',  trend:'↑ 12%', unload:'₦2.1M',   txnvol:'₦47.8M',  txncount:'2,341',  pending:'12', failed:'7'  },
  week:   { issued:'1,247', added:'+92',  active:'1,089', frozen:'38',  terminated:'120', funding:'₦94.2M',  trend:'↑ 8%',  unload:'₦12.4M',  txnvol:'₦284.6M', txncount:'14,820', pending:'29', failed:'31' },
  month:  { issued:'1,247', added:'+341', active:'1,089', frozen:'38',  terminated:'120', funding:'₦382.7M', trend:'↑ 21%', unload:'₦44.1M',  txnvol:'₦1.2B',   txncount:'58,991', pending:'47', failed:'104'},
  custom: { issued:'1,247', added:'+128', active:'1,089', frozen:'38',  terminated:'120', funding:'₦142.0M', trend:'↑ 15%', unload:'₦18.8M',  txnvol:'₦465.2M', txncount:'22,408', pending:'33', failed:'49' },
}

export default function Dashboard() {
  const [range, setRange] = useState<Range>('today')
  const [refreshing, setRefreshing] = useState(false)
  const d = useMemo(() => KPI_DATA[range], [range])

  function onRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value as Range
    if (v === 'custom') {
      const dr = window.prompt('Custom range (yyyy-mm-dd to yyyy-mm-dd):', '2026-04-01 to 2026-04-30')
      if (!dr) {
        setRange('today')
        return
      }
    }
    setRange(v)
  }

  function onRefresh() {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 700)
  }

  return (
    <main className="scr-main">
    <div className="container">
      <header className="page-head">
        <div>
          <h1 className="home-hello">Good afternoon, Adaeze</h1>
          <p className="home-org">
            Signed in as Affiliate · <strong>Kardit Lagos</strong>
          </p>
        </div>
      </header>

      <section>
        <div className="section-head">
          <div>
            <div className="section-title">Today at a glance</div>
            <div className="section-sub">Tenant scope · Kardit Lagos</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={range}
              onChange={onRangeChange}
              style={{
                padding: '7px 11px', fontSize: 12,
                border: '1px solid var(--cs-line-strong)',
                borderRadius: 'var(--cs-radius-sm)',
                background: 'var(--cs-white)', fontFamily: 'inherit',
                color: 'var(--cs-ink-700)', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="custom">Custom range…</option>
            </select>
            <button
              onClick={onRefresh}
              aria-label="Refresh KPIs"
              style={{
                padding: '7px 10px', fontSize: 12,
                border: '1px solid var(--cs-line-strong)',
                borderRadius: 'var(--cs-radius-sm)',
                background: 'var(--cs-white)', cursor: 'pointer',
                color: 'var(--cs-ink-700)', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
            >
              {refreshing ? (
                <Loader2 style={{ width: 13, height: 13 }} className="spin" />
              ) : (
                <RefreshCw style={{ width: 13, height: 13 }} />
              )}{' '}
              {refreshing ? 'Loading…' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="kpi-stub">
          <Kpi label="Cards issued" value={d.issued}
               sub={<><span style={{ color: 'var(--cs-green-700)', fontWeight: 700 }}>{d.added}</span> in selected range</>} />
          <Kpi label="Active" value={d.active} sub="87.3% of issued" />
          <Kpi label="Frozen" value={d.frozen} valueStyle={{ color: '#1B547F' }} sub="3.0% of issued" />
          <Kpi label="Terminated" value={d.terminated} valueStyle={{ color: 'var(--cs-ink-200)' }} sub="retired this year" />
        </div>

        <div className="kpi-stub" style={{ marginTop: 14 }}>
          <Kpi label="Funding volume" value={d.funding}
               sub={<><span style={{ color: 'var(--cs-green-700)', fontWeight: 700 }}>{d.trend}</span> vs prev range</>} />
          <Kpi label="Unload volume" value={d.unload} sub="14 unload txns" />
          <Kpi label="Txn volume" value={d.txnvol} sub="spend across all cards" />
          <Kpi label="Txn count" value={d.txncount} sub="authorisations" />
        </div>

        <div className="kpi-stub" style={{ marginTop: 14, gridTemplateColumns: '1fr 1fr' }}>
          <Kpi label="Pending maker-checker" value={d.pending}
               sub="4 batches · 8 single loads · awaiting checker" />
          <Kpi label="Failed transactions" value={d.failed}
               valueStyle={{ color: 'var(--cs-red-700)' }}
               sub="3 CMS timeouts · 4 insufficient funds" />
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <div className="section-title">Get started</div>
            <div className="section-sub">Available journeys in this build</div>
          </div>
        </div>

        <div className="action-grid">
          <ActionCard to="/portal/customers/new" icon={<UserPlus />}
                      title="New customer"
                      meta="Capture a customer record (identity, contact, address, KYC) and save it as a draft. Issue a card now or come back later." />
          <ActionCard to="/portal/batches" icon={<UploadCloud />}
                      title="Batch issuance"
                      meta="Upload many customers in one CSV. Validate, submit, get approved by a checker, then process to CMS." />
          <ActionCard to="/portal/customers" icon={<Search />}
                      title="Find a customer"
                      meta="Search captured customers by name, phone, customer ref, BVN, or NIN. View profile, KYC details, and linked cards." />
          <ActionCard to="/portal/issue-card" icon={<CreditCard />}
                      title="Issue a card"
                      meta="Create customer and issue a virtual or physical card in one flow. Auto-provisions a linked virtual account for funding." />
          <ActionCard to="/portal/funds" icon={<Wallet />}
                      title="Load funds"
                      meta="Top up a card's linked virtual account. Maker-checker workflow — you submit, a different user approves before CMS fires." />
          <ActionCard to="/portal/reports" icon={<BarChart3 />}
                      title="Reports" cta="Open"
                      meta="Generate operational reports (daily activity, card issuance, funding volume, audit log). Download as CSV or PDF." />
          <ActionCard to="/portal/bank" tag="Bank role" icon={<Building2 />}
                      title="View as Issuing Bank" cta="Switch role"
                      dashed
                      meta="Demo: switch persona to a Bank user (Chioma N. at Zenith Bank). See the portfolio view across all affiliates issuing under your bank." />
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <div className="section-title">Recent activity</div>
            <div className="section-sub">Latest actions on this tenant</div>
          </div>
        </div>
        <div className="recent">
          <RecentRow icon={<CreditCard />} tone="green"
                     to="/portal/customers/CUST-2026-00344"
                     title="Card issued · CARD-2026-VRP01029 · Tunde Bakare"
                     meta="Zenith Bank · Verve Prepaid Standard · by Adaeze O." time="12 min ago" />
          <RecentRow icon={<UserPlus />} tone="amber"
                     to="/portal/customers/CUST-2026-00345"
                     title="Customer captured · Adaeze Okafor"
                     meta="DRAFT · CUST-2026-00345 · awaiting card issuance" time="38 min ago" />
          <RecentRow icon={<Wallet />} tone="blue"
                     to="/portal/funds?cardId=CARD-2026-VRP01028"
                     title="Funds loaded · ₦50,000.00 · Chiamaka Eze"
                     meta="Approved by Folake A. · CMS confirmed · CARD-2026-VRP01028" time="2 hr ago" />
          <RecentRow icon={<CheckCheck />} tone="green"
                     to="/portal/batches/result"
                     title="Batch BATCH-2026-00018 completed · 47 customers · 47 cards"
                     meta="Approved by Folake A. · 0 errors · 4 min processing" time="Yesterday" />
          <RecentRow icon={<Snowflake />} tone="blue"
                     to="/portal/card/CARD-2026-VRP00984"
                     title="Card frozen · CARD-2026-VRP00984"
                     meta="Reason: Customer request · by Adaeze O." time="Yesterday" />
        </div>
      </section>
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

function ActionCard({
  to, tag, icon, title, meta, cta = 'Start', dashed = false,
}: {
  to: string; tag?: string; icon: React.ReactNode; title: string;
  meta: string; cta?: string; dashed?: boolean;
}) {
  return (
    <Link to={to} className="action-card" style={dashed ? { borderStyle: 'dashed' } : undefined}>
      {tag && (
        <span className="ujr-tag"
              style={dashed ? { background: '#FFF6DD', color: '#7A5800', borderColor: '#F2DC9E' } : undefined}>
          {tag}
        </span>
      )}
      <div className="action-icon"
           style={dashed ? { background: '#FFF6DD', color: '#7A5800', borderColor: '#F2DC9E' } : undefined}>
        {icon}
      </div>
      <div className="action-title">{title}</div>
      <div className="action-meta">{meta}</div>
      <div className="action-cta">
        {cta} <ArrowRight />
      </div>
    </Link>
  )
}

const toneStyles: Record<string, React.CSSProperties> = {
  green: { background: 'var(--cs-green-100)', color: 'var(--cs-green-700)', border: '1px solid var(--cs-green-300)' },
  amber: { background: '#FFF6DD', color: '#7A5800', border: '1px solid #F2DC9E' },
  blue:  { background: '#E8F0F7', color: '#1B547F', border: '1px solid #B7D2EA' },
}

function RecentRow({
  icon, tone, title, meta, time, to, pending,
}: {
  icon: React.ReactNode; tone: keyof typeof toneStyles;
  title: string; meta: string; time: string;
  to?: string; pending?: string;
}) {
  const body = (
    <>
      <div className="recent-row__icon" style={toneStyles[tone]}>{icon}</div>
      <div className="recent-row__body">
        <div className="recent-row__title">{title}</div>
        <div className="recent-row__meta">{meta}</div>
      </div>
      <div className="recent-row__time">{time}</div>
    </>
  )
  if (to) {
    return <Link to={to} className="recent-row">{body}</Link>
  }
  return (
    <a href="#activity" className="recent-row"
       onClick={(e) => {
         e.preventDefault()
         if (pending) window.alert(pending)
       }}>
      {body}
    </a>
  )
}
