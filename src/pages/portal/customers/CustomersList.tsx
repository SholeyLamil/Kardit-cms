import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Search, SearchX, UserPlus, X } from 'lucide-react'
import {
  CUSTOMERS,
  customerFullName,
  customerInitials,
  relativeTime,
} from './data'
import type { KycLevel, CustomerStatus, CustomerRecord } from './data'

type KycFilter = 'all' | KycLevel
type StatusFilter = 'all' | CustomerStatus

export default function CustomersList() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [kyc, setKyc] = useState<KycFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CUSTOMERS.filter((c) => {
      if (kyc !== 'all' && c.kycLevel !== kyc) return false
      if (status !== 'all' && c.status !== status) return false
      if (!q) return true
      const hay = [
        c.ref, customerFullName(c), c.phone, c.email ?? '', c.bvn, c.nin ?? '',
      ].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [query, kyc, status])

  function clearFilters() {
    setQuery('')
    setKyc('all')
    setStatus('all')
  }

  return (
    <main className="scr-main">
      <div className="container">
        <header className="page-head">
          <div>
            <h1 className="page-title">Customers</h1>
            <p className="page-sub">
              Search and view captured customers in your tenant. Click any row to open the
              profile.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/portal/customers/new" className="btn btn-primary">
              <UserPlus /> New customer
            </Link>
          </div>
        </header>

        <section className="card" style={{ padding: '18px 22px' }}>
          <div className="list-toolbar">
            <div className="search-input-wrap">
              <Search className="search-icn" />
              <input
                type="text" autoComplete="off" autoFocus
                placeholder="Search by name, phone, customer ref, BVN, or NIN"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 14 }}>
            <div>
              <FilterLabel>KYC level</FilterLabel>
              <div className="filter-chips">
                <Chip active={kyc === 'all'} onClick={() => setKyc('all')}>All</Chip>
                <Chip active={kyc === 'LEVEL_3'} onClick={() => setKyc('LEVEL_3')}>Tier 3</Chip>
                <Chip active={kyc === 'LEVEL_2'} onClick={() => setKyc('LEVEL_2')}>Tier 2</Chip>
                <Chip active={kyc === 'LEVEL_1'} onClick={() => setKyc('LEVEL_1')}>Tier 1</Chip>
              </div>
            </div>
            <div>
              <FilterLabel>Status</FilterLabel>
              <div className="filter-chips">
                <Chip active={status === 'all'} onClick={() => setStatus('all')}>All</Chip>
                <Chip active={status === 'DRAFT'} onClick={() => setStatus('DRAFT')}>Draft</Chip>
                <Chip active={status === 'ACTIVE'} onClick={() => setStatus('ACTIVE')}>Active</Chip>
                <Chip active={status === 'FROZEN'} onClick={() => setStatus('FROZEN')}>Frozen</Chip>
              </div>
            </div>
          </div>
        </section>

        <div className="result-meta">
          Showing <strong>{filtered.length}</strong> of <strong>{CUSTOMERS.length}</strong> customers
        </div>

        <section className="card" style={{ padding: 0 }}>
          <table className="data customers">
            <thead>
              <tr>
                <th style={{ width: 160 }}>Reference</th>
                <th>Name</th>
                <th>Phone</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Cards</th>
                <th>Created</th>
                <th className="right" style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-list">
                    <SearchX />
                    <div className="empty-list-title">No customers match those filters</div>
                    <div className="empty-list-sub">
                      Try changing or clearing the filters above.<br />
                      Search runs against name, phone, ref, BVN, and NIN.
                    </div>
                    <button className="btn btn-secondary" onClick={clearFilters}>
                      <X /> Clear filters
                    </button>
                  </div>
                </td></tr>
              ) : (
                filtered.map((c) => (
                  <CustomerRow key={c.ref} c={c} onOpen={() =>
                    navigate(`/portal/customers/${encodeURIComponent(c.ref)}`)} />
                ))
              )}
            </tbody>
          </table>
        </section>

        <div className="notice info" style={{ marginTop: 10 }}>
          <InfoIcon />
          <div>
            <span className="strong">Scope.</span>{' '}
            This list is segregated to your tenant. Issuing-bank users see only customers
            under their bank's cards; service-provider users see globally.
          </div>
        </div>
      </div>
    </main>
  )
}

function CustomerRow({ c, onOpen }: { c: CustomerRecord; onOpen: () => void }) {
  const name = customerFullName(c)
  return (
    <tr onClick={onOpen} style={{ cursor: 'pointer' }}>
      <td className="id">{c.ref}</td>
      <td>
        <div className="name">
          <div className="avatar-sm">{customerInitials(c)}</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--cs-ink-700)' }}>{name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--cs-ink-100)' }}>
              {c.email ?? c.phone}
            </div>
          </div>
        </div>
      </td>
      <td className="mono" style={{ fontSize: 12, color: 'var(--cs-ink-200)' }}>{c.phone}</td>
      <td><KycBadge level={c.kycLevel} /></td>
      <td><StatusBadge status={c.status} /></td>
      <td className="kyc-cell">{c.cards.length}</td>
      <td className="meta">{relativeTime(c.createdAt)}</td>
      <td className="right">
        <Link to={`/portal/customers/${encodeURIComponent(c.ref)}`}
              className="icon-button" aria-label="View profile"
              onClick={(e) => e.stopPropagation()}>
          <ChevronRight />
        </Link>
      </td>
    </tr>
  )
}

function Chip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button className={active ? 'filter-chip is-active' : 'filter-chip'} onClick={onClick}>
      {children}
    </button>
  )
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
      color: 'var(--cs-ink-100)', fontWeight: 700, marginBottom: 8,
    }}>
      {children}
    </div>
  )
}

export function StatusBadge({ status }: { status: CustomerStatus | 'TERMINATED' }) {
  return <span className={`badge status-${status.toLowerCase()}`}>{status}</span>
}

export function KycBadge({ level }: { level: KycLevel }) {
  const n = level.replace('LEVEL_', '')
  return <span className={`kyc-pill lvl-${n}`}>Tier {n}</span>
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
